# Codex of Solana — Design Document

_Date: 2026-06-01_

---

## Overview

A personal Flesh and Blood card collection manager. Users can browse the full FaB card catalog, filter and search cards, track their owned cards (by printing, edition, foiling), see what they're missing, and export a wishlist for CardMarket.

Browsing and filtering are available without authentication. Collection management requires an account.

---

## Tech Stack

| Layer               | Technology                                               |
| ------------------- | -------------------------------------------------------- |
| Monorepo            | Turborepo + pnpm                                         |
| Language            | TypeScript throughout                                    |
| Frontend            | React, Redux Toolkit, shadcn/ui, Tailwind CSS            |
| Backend             | NestJS                                                   |
| ORM                 | Prisma                                                   |
| Database            | PostgreSQL                                               |
| Validation          | Zod (API layer)                                          |
| Linting/Formatting  | ESLint + Prettier                                        |
| Email               | SendGrid                                                 |
| Card metadata       | `@flesh-and-blood/cards` + `@flesh-and-blood/types`      |
| Card images         | `https://content.fabrary.net/cards/{identifier}.webp`    |
| Fuzzy search        | Fuse.js (client-side, injected via Redux extra argument) |
| Grid virtualization | TanStack Virtual                                         |

---

## Monorepo Structure

```
codex-of-solana/
├── apps/
│   ├── api/                          # NestJS backend
│   └── web/                          # React frontend
├── packages/
│   ├── core/                         # Domain + Application + Infrastructure
│   ├── shared/                       # Shared DTOs and Zod schemas (no logic)
│   └── config/                       # Shared ESLint, TS, Prettier configs
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Principles:**

- `core` has zero framework dependencies — pure TypeScript, importable by any package.
- `shared` holds only DTO types and Zod schemas agreed upon by frontend and backend — no domain logic.
- `apps/api` wires NestJS DI and imports use cases from `core`.
- `apps/web` imports only from `shared` for API types, never from `core` directly.

---

## Core Package — Vertical Slices

Each bounded context owns its domain, application, and infrastructure layers:

```
packages/core/src/
├── user/
│   ├── domain/
│   │   ├── user.entity.ts
│   │   ├── user-identity.value-object.ts
│   │   ├── password-reset-token.value-object.ts
│   │   └── user.errors.ts
│   ├── application/
│   │   ├── register-user.usecase.ts
│   │   ├── login-user.usecase.ts
│   │   ├── link-discord-identity.usecase.ts
│   │   ├── forgot-password.usecase.ts
│   │   ├── reset-password.usecase.ts
│   │   └── user.repository.ts            # interface
│   └── infrastructure/
│       ├── prisma-user.repository.ts
│       └── in-memory-user.repository.ts
├── collection/
│   ├── domain/
│   │   ├── collection.entity.ts
│   │   ├── collection-entry.entity.ts
│   │   ├── collection-missing.service.ts  # domain service: missing quantity logic
│   │   └── collection.errors.ts
│   ├── application/
│   │   ├── add-card-to-collection.usecase.ts
│   │   ├── update-collection-entry.usecase.ts
│   │   ├── remove-card-from-collection.usecase.ts
│   │   ├── get-collection.usecase.ts
│   │   └── collection.repository.ts      # interface
│   └── infrastructure/
│       ├── prisma-collection.repository.ts
│       └── in-memory-collection.repository.ts
└── card-catalog/
    ├── application/
    │   ├── get-all-cards.usecase.ts
    │   └── card-catalog.repository.ts    # interface
    └── infrastructure/
        └── fab-card-catalog.repository.ts  # wraps @flesh-and-blood/cards
```

`card-catalog` has no domain layer — card data is owned by the npm package and treated as a read-only external source.

---

## Domain Model

### User

```
User
  id: UserId (UUID)
  email: Email | null              # null for OAuth-only accounts
  passwordHash: PasswordHash | null
  identities: UserIdentity[]
  createdAt: Date

UserIdentity
  provider: AuthProvider           # enum: 'discord' (extensible)
  externalId: string               # provider-specific user ID

PasswordResetToken
  token: UUID
  userId: UserId
  expiresAt: Date                  # 1 hour from creation
```

**Invariant:** A user must have at least one authentication method (passwordHash or at least one identity).

**Discord linking:** If a user registers via email and later logs in with Discord using the same email, the Discord identity is automatically linked to the existing account.

### Collection

```
Collection
  id: CollectionId (UUID)
  userId: UserId
  entries: CollectionEntry[]

CollectionEntry
  id: CollectionEntryId (UUID)
  printingId: PrintingId           # e.g. "WTR-001" — identifier from FaB package
  cardId: CardId                   # e.g. "sink-below" — groups entries by card
  edition: Edition                 # e.g. "Alpha", "Unlimited"
  foiling: Foiling                 # e.g. "Regular", "Rainbow Foil", "Cold Foil"
  isAlternateArt: boolean
  quantity: Quantity               # positive integer ≥ 1
```

One collection per user. Alternate art printings are always separate entries.

### Missing Quantity (Domain Service)

```
targetQuantity = isLegendary(card) || isEquipment(card) ? 1 : 3
missingQuantity = max(0, targetQuantity - ownedQuantity)
isMissing = missingQuantity > 0
```

A playset is 3 copies for non-legendary, non-equipment cards. This rule lives in `collection/domain/collection-missing.service.ts`.

---

## Backend Architecture

```
apps/api/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/register, /auth/login, /auth/logout
│   │                          # POST /auth/forgot-password, /auth/reset-password
│   │                          # POST /auth/refresh
│   │                          # GET  /auth/discord, /auth/discord/callback
│   ├── auth.guard.ts          # JWT guard for protected routes
│   └── auth.schemas.ts        # Zod request validation schemas
├── cards/
│   ├── cards.module.ts
│   ├── cards.controller.ts    # GET /cards
│   └── cards.schemas.ts
├── collection/
│   ├── collection.module.ts
│   ├── collection.controller.ts  # GET /collection
│   │                             # POST /collection/entries
│   │                             # PATCH /collection/entries/:id
│   │                             # DELETE /collection/entries/:id
│   └── collection.schemas.ts
├── app.module.ts
└── main.ts
```

**Auth tokens:**

- Short-lived JWT access token (15 min) returned in response body, stored in Redux state (memory only — never localStorage).
- Long-lived refresh token (7 days) in an HTTP-only cookie.
- `POST /auth/refresh` silently rotates the refresh token and returns a new access token.
- On 401, the frontend automatically retries via the refresh endpoint before logging the user out.

**Validation:** All request bodies validated with Zod at the controller level via a NestJS pipe. Invalid payloads rejected with 400 before reaching any use case.

**DI wiring:** NestJS modules provide use cases and inject concrete repository implementations. `core` has no NestJS dependency.

---

## Frontend Architecture

```
apps/web/src/
├── components/                       # Dumb/presentational only
│   ├── card/
│   │   ├── CardGrid.tsx              # Virtualized grid (TanStack Virtual)
│   │   ├── CardGridItem.tsx          # Single card slot
│   │   ├── CardDetail.tsx            # Zoomed card + metadata + printings
│   │   └── CardBack.tsx              # Empty slot placeholder
│   ├── collection/
│   │   └── CollectionEntryModal.tsx  # Add/edit printing + quantity
│   ├── filters/
│   │   ├── FilterPanel.tsx
│   │   ├── RarityFilter.tsx
│   │   ├── SearchInput.tsx
│   │   └── OrderingControls.tsx
│   └── ui/                           # shadcn primitives
├── store/
│   ├── index.ts                      # Store setup + thunk extra argument (DI)
│   ├── card-catalog/
│   │   ├── card-catalog.slice.ts     # allCards, searchResults, loading, error
│   │   ├── card-catalog.thunks.ts    # fetchAllCards, searchCards
│   │   └── card-catalog.selectors.ts # filteredCards, groupedGridSlots
│   ├── collection/
│   │   ├── collection.slice.ts
│   │   ├── collection.thunks.ts
│   │   └── collection.selectors.ts  # ownedPrintings, missingCards, exportText
│   ├── filters/
│   │   ├── filters.slice.ts          # activeFilters, searchQuery, ordering, toggles
│   │   └── filters.selectors.ts
│   └── auth/
│       ├── auth.slice.ts
│       └── auth.thunks.ts
├── views/                            # Pages: select data, dispatch actions only
│   ├── CardListingView.tsx
│   ├── CardDetailView.tsx
│   ├── CollectionView.tsx
│   └── AuthView.tsx
└── main.tsx                          # Provider + store setup
```

**Key principles:**

- Components are dumb: they receive computed data from selectors and dispatch actions on user interaction. No filtering or business logic inside components.
- All grid layout logic (color grouping, legendary centering, binder page breaks, missing slot computation) lives in `card-catalog.selectors.ts` and `collection.selectors.ts`.
- Views are thin wires between selectors and components.

### Dependency Injection via Extra Argument

The Redux thunk extra argument carries all external dependencies:

```ts
interface ThunkDependencies {
  cardService: ICardService; // GET /cards API client
  collectionService: ICollectionService;
  authService: IAuthService;
  searchService: ISearchService; // Fuse.js in prod, simple match in tests
}
```

Thunks never import fetch, axios, or Fuse.js directly. In tests, inject in-memory implementations for all services (e.g. `InMemorySearchService`, `InMemoryCardService`, `InMemoryCollectionService`).

### Fuzzy Search

`ISearchService` interface with two implementations:

- **FuseSearchService** (production): builds Fuse index once when cards load via `fetchAllCards`, searches by name, identifier, class, talent, description.
- **InMemorySearchService** (tests): simple `toLowerCase().includes()` match.

Search is synchronous. `searchCards(query)` is a regular thunk that calls `extra.searchService.search(query)` and dispatches `setSearchResults`. Search composes with all other active filters via `filteredCards` selector.

### Grid Layout

The `groupedGridSlots` selector produces a flat array of typed slots:

```ts
type GridSlot =
  | { type: 'card'; card: CardDto; printing: PrintingDto; owned: boolean }
  | { type: 'empty' }
  | { type: 'page-break' };
```

Rules (applied in order):

1. Group cards by base card identity, order color rows: Red → Yellow → Blue.
2. Colors that don't exist for a card are skipped (no gap).
3. Legendary cards: placed in the middle slot `[empty][card][empty]`. If middle is taken, advance to the next row.
4. Equipment cards: sequential, up to 3 per row.
5. Promo toggle: swap displayed printing to promo version where available.
6. Binder toggle: insert `page-break` slot after every 9 card/empty slots.

TanStack Virtual renders only visible rows. Each row is 3 slots wide. Page-break slots render as a taller gap row.

Images use native `loading="lazy"` — virtualization ensures off-screen images never mount.

### Hover Actions

On every card (both listing and collection views), hovering shows:

- Card code tooltip (e.g. `WTR-001`)
- `- [quantity] +` quantity control (quantity = 0 if not owned; `-` disabled at 0)
- Printing selector (edition + foiling) when the card has multiple printings or when adding for the first time
- If the card has a promo version: a per-card toggle to switch between regular and promo art (independent of the global promo filter)

If unauthenticated, pressing `+` opens a login/signup prompt instead.

### Card Detail View

Clicking a card opens a detail view (zoomed image + full metadata: name, code, class, talent, type, rarity, keywords, description, etc.). All available printings and arts are listed and selectable, allowing the user to switch between them.

Navigating back from the detail view restores the exact scroll position, active filters, and ordering of the listing — the same card appears in the same position as before.

---

## Card Catalog Flow

```
App startup
  → fetchAllCards thunk
  → GET /cards
  → FabCardCatalogRepository maps @flesh-and-blood/cards → CardDto[]
  → searchService.index(cards)           # Fuse index built once
  → Redux: allCards populated
  → groupedGridSlots selector computes grid
  → TanStack Virtual renders visible rows
```

Subsequent filter/search changes are pure selector recomputations — no API calls.

---

## Collection Management

**Adding/updating:** Pressing `+` on a card opens `CollectionEntryModal` (if authenticated) with printing selector and quantity input. Confirms via `POST /collection/entries` or `PATCH /collection/entries/:id`.

**Removing:** Pressing `-` to reach 0 removes the entry via `DELETE /collection/entries/:id`.

**Missing cards:** Toggling "show missing" switches the collection view to render the full expected grid (same rules as card listing) with owned slots showing the card and missing slots showing `CardBack`. Active filters (set, foiling) are respected — owning a Regular copy does not satisfy a Rainbow Foil filter.

**Export:** Available when "show missing" is on. `exportText` selector formats missing cards as:

```
2 Sink Below Red
1 Prism, Sculptor of Arc Light
```

Copied to clipboard via the Clipboard API. Pure client-side — no backend call.

---

## Filters & Ordering

All filters compose with AND logic. "Exclude" variants are supported for class, talent, type, rarity, and keywords — they exclude cards matching that criterion.

| Filter       | Options                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------ |
| Class        | Brute, Guardian, Ninja, ... (multi-select, supports exclude)                               |
| Talent       | Draconic, Light, Earth, ... (multi-select, supports exclude)                               |
| Type         | Action, Equipment, ... (multi-select, supports exclude)                                    |
| Rarity       | Exact match, above X, below X (supports exclude)                                           |
| Keywords     | Legendary, Go Again, ... (multi-select, supports exclude)                                  |
| Foiling      | Exact match or "above regular" (Rainbow Foil, Cold Foil, Alternate Art)                    |
| Set          | Filter by set edition (multi-select; in collection view, matches against printing edition) |
| Dual class   | Filter for cards with exactly two classes                                                  |
| Promo toggle | Global show/hide promo versions across the listing                                         |
| Search       | Fuzzy match across name, identifier, class, talent, description                            |

**Rarity order (low → high):**
Basic → Token → Common → Rare → Super Rare → Majestic → Legendary → Fabled → Marvel

Promo is excluded from the rarity scale and handled separately via the promo toggle.

**Default ordering:** Set release date ASC, then card number ASC within a set. Options: DESC, and "incomplete color rows first/last" (cards that don't exist in all 3 colors).

**Set release order (ASC):**
WelcomeToRathe, ArcaneRising, CrucibleOfWar, Monarch, TalesOfAria, Everfest, HistoryPack1, RhinarBlitzDeck, ClassicBattlesRhinarDorinthea, Uprising, Dynasty, Outsiders, DuskTillDawn, RoundTheTable, BrightLights, HeavyHitters, ArmoryDeckKayo, PartTheMistveil, ArmoryDeckBoltyn, FirstStrikeAurora, FirstStrikeTerra, ArmoryDeckAzalea, Rosetta, ArmoryDeckDash, ArmoryDeckOriginsJarl, TheHunted, ArmoryDeckAurora, ArmoryDeckMaxx, ArmoryDeckGravyBones, HighSeas, ArmoryDeckIra, ArmoryDeckLegendsPrism, ArmoryDeckLegendsViserai, MasteryPackGuardian, ArmoryDeckPleiades, SuperSlam, SmashPalace, ArmoryDeckRhinar, ArmoryDeckArakni, CompendiumOfRathe, ArmoryDeckOriginsHala, ArmoryDeckZyggy, OmensOfTheThirdAge, GEM, TournamentPack

---

## Testing Strategy

### Backend (core package)

**Sociable unit tests** (`.spec.ts`, co-located in `__tests__/`):

- Test use case behaviour end-to-end using in-memory repository implementations.
- Format: `test('Rule: <description>', ...)`
- One test per business rule: happy path, each error case, each auth failure.
- Fixture files expose `givenExistingUser()`, `whenAddingCardToCollection()`, `thenCardShouldBeInCollection()`, etc.
- Builders: fluent `userBuilder().withName('John').build()` wrapping `User.create()`.

**Integration tests** (`.integration.test.ts`, in `infrastructure/repositories/__tests__/`):

- One file per Prisma repository.
- Bootstrapped via Testcontainers + Prisma migrations.
- Seeded via Prisma Fabbrica factories (`UserFactory.create()`).
- Wrapped in transactions for rollback isolation (`wrapInTransaction(prisma, ...)`).
- Tests: correct return when found, null when not found, correct persistence after save.

### Frontend (apps/web)

**Store unit tests** (`.spec.ts`, co-located with slices/thunks):

- Format: given store in state A → dispatch action B → store should be in state C.
- Stores are often preloaded with an explicit initial state (via `configureStore({ preloadedState: ... })`) to set up the scenario before dispatching actions.
- Inject in-memory implementations of all service interfaces via extra argument (e.g. `InMemorySearchService`, `InMemoryCardService`, `InMemoryCollectionService`).
- Test selectors independently with known state shapes.
- No component rendering in these tests — pure Redux state verification.

### Shared principles

- **D.A.M.P.** (Descriptive And Meaningful Phrases): fixture files and builders make test scenarios readable without reading implementation details.
- No tests for single methods in isolation — test behaviour of units as a whole.
- Base `createFixture()` provides shared helpers (`thenErrorShouldBe`, etc.) extended by domain-specific fixtures.

---

## Out of Scope (MVP)

- Self-hosting card images and metadata
- Deployment / infrastructure setup
- Multiple collections per user
- Social features
