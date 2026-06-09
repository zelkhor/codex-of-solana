# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App overview

A personal Flesh and Blood card collection manager. Users can browse the full FaB card catalog, filter and search cards, track their owned cards (by printing, edition, foiling), see what they're missing, and export a wishlist for CardMarket.
Browsing and filtering are available without authentication. Collection management requires an account.

## Tech Stack

| Layer              | Technology                                               |
| ------------------ | -------------------------------------------------------- |
| Monorepo           | Turborepo + pnpm                                         |
| Language           | TypeScript throughout                                    |
| Frontend           | React, Redux Toolkit, shadcn/ui, Tailwind CSS            |
| Backend            | NestJS                                                   |
| ORM                | Prisma                                                   |
| Database           | PostgreSQL                                               |
| Validation         | Zod (API layer)                                          |
| Linting/Formatting | ESLint + Prettier                                        |
| Email              | SendGrid                                                 |
| Fuzzy search       | Fuse.js (client-side, injected via Redux extra argument) |

## Monorepo Structure

```
codex-of-solana/
├── apps/
│   ├── api/                          # NestJS backend (port 3001)
│   ├── fab-card-registry/            # Node script - CLI
│   └── web/                          # React frontend (port 3000, /api proxied to 3001)
├── packages/
│   ├── config/                       # Shared ESLint, TS, Prettier configs
│   ├── core/                         # Domain + Application + Infrastructure and shared kernel (e.g. AppError)
│   └── orm/                          # Prisma schema, client re-export, fabbrica factories, migrations
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Applications

### apps/api — NestJS

Api layer using NestJS. It is kept very thin and is responsible for handling DI, instantiating use-cases, repositories and adapters and calling use-cases from HTTP controllers.
Each domain has a NestJS module. The module wires use cases to concrete repositories via `useFactory`. A global `HttpError` converts thrown `AppError` instances into HTTP responses.

### apps/web — React / Redux toolkit

This is the React app displaying the front-end to our users.
State is managed with Redux Toolkit. Thunks receive **gateway** dependencies (`ThunkDependencies`) via `extraArgument` injected at store creation — never imported directly.

The `src/` folder is split into three top-level areas:

```
src/
├── domain/          # State + logic, organised by bounded context
│   ├── card-catalog/
│   │   ├── application/    # RTK slice (card-catalog.slice.ts) + thunks
│   │   ├── domain/         # Pure selectors (no side effects)
│   │   └── infrastructure/ # Gateway implementations + integration tests
│   ├── filter/
│   │   ├── application/    # RTK slice (filters.slice.ts)
│   │   ├── domain/         # Pure selectors
│   │   └── infrastructure/ # filters.storage.ts (localStorage persistence)
│   └── store/          # Composition root: createStore, rootReducer, AppDispatch, AppThunk, createAppAsyncThunk
│       └── __tests__/  # createTestStore, stateBuilder, stateBuilderProvider, createFixture
├── features/        # UI only, organised by feature and use-case
│   └── cards/
│       ├── pages/          # Page-level components + view models
│       ├── ui/             # Reusable card UI components
│       └── use-cases/
│           ├── filter-cards/
│           ├── list-cards/
│           └── view-card-details/
└── shared/          # Cross-cutting infrastructure
    ├── gateways/    # HttpClient wrapper
    ├── hooks/       # useDebounced, useKeydown, useClickOutside, useTheme
    ├── layout/      # AppHeader
    ├── types/       # async-status.ts (ASYNC_STATUS), comparison-operator.ts, sort-order.ts
    └── ui/          # Shared shadcn-based components (MultiSelect, NumericFilterInput, etc.)
```

**Gateway pattern:** `I{Name}Gateway` interface + `{name}.api.gateway.ts` (real) + `{name}.inmemory.gateway.ts` (test double). HTTP goes through `HttpClient`.

**Store creation** (`main.tsx`) wires real gateways and preloads filter state from localStorage. `store.subscribe` saves filters back on every change.

**Composition root** — the store lives in `domain/store/` (not `shared/`). It is the one place that aggregates every bounded context's slice and gateway, so it sits at the root of the `domain/` layer it composes. This is why `shared/` can stay a true leaf (`shared/` must never import `domain/`); `domain/store/` importing sibling contexts is an allowed intra-`domain/` edge, and `features/` importing the store is the normal `features/ → domain/` edge.

**Routing** (`react-router`): `/` → `CardListingPage`, `/cards/:cardIdentifier` → `CardDetailsPage`.

**Filter persistence:** filters slice is serialised to localStorage under key `codex:filters` via `filters.storage.ts`.

#### Dependency flow (apps/web)

```
@codex/core  ──►  shared  ──►  domain  ──►  features
```

| Layer                                | May import from                                      | Must never import from              |
| ------------------------------------ | ---------------------------------------------------- | ----------------------------------- |
| `shared/`                            | `@codex/core`, external libs                         | `domain/`, `features/`              |
| `shared/ui/`                         | external UI libs (shadcn, Tailwind, React) only      | anything in this repo               |
| `domain/`                            | `shared/`, `@codex/core`                             | `features/`                         |
| `features/{context}/`                | `domain/`, `shared/`, `@codex/core`                  | other `features/` contexts          |
| `features/{context}/use-cases/{uc}/` | `domain/`, `shared/`, sibling `ui/`, parent `pages/` | other use-cases in the same context |

**`shared/ui`** — purely presentational building blocks (shadcn wrappers, layout primitives). They receive everything via props and have zero knowledge of application state, domain types, or business logic.

**`features/{context}/`** — one folder per product context (e.g. `cards/`). A context owns its pages, reusable UI components, and the use-cases that compose it:

- `pages/` — route-level entry point, wires use-cases together
- `ui/` — context-specific visual components reusable across use-cases in the same context
- `use-cases/{name}/` — one folder per distinct user scenario (`list-cards`, `filter-cards`, `view-card-details`). Self-contained: components, view model, and presentation selectors all live here. **A use-case cannot import from a sibling use-case.**

### apps/fab-card-registry

This app is used to import FaB reference data from the `@flesh-and-blood/cards` + `@flesh-and-blood/types` packages into our PostgreSQL database.

- **Goal:** Insert every card, talent, class, type, keyword, artist, etc. from the package into the DB. The script is run manually on each new set release to pull in updated data. This replaces the reference data currently stored as `as const` objects in `core/shared/game`.
- **Source-of-truth rule:** The database is always the source of truth. The script is **additive only** — it may insert new rows (a new card, talent, artist, class, …) but must NEVER override or mutate data that already exists. First run inserts everything; later runs insert only the rows that don't exist yet.
- **Architecture:** Domain aggregates, value objects, use-cases, and repositories for this feature live in `packages/core` (shared across apps), following the existing bounded-context layout (`domain/` aggregates + invariants, `application/` use-case + repository interface, `infrastructure/` concrete repos). The seeding script drives these use-cases. Always diff against existing DB rows and insert only the missing ones.

## packages/core

This package contains domain aggregates or types, value-objects, use cases, repository interfaces, and concrete implementations. No web or API concerns. Also contains shared kernel types (`AppError`, `Result`).
Every app should import from the core package while the core package should never depend on any other package except `config` and `orm` packages.

This project is organized using a vertical slice for each bounded context. This is to enforce Screaming architecture.
Each slice is separated into 3 layers :

- `domain/` — error types, aggregate roots (`Card`, `Printing`) with domain logic and invariants, value-objects; no data-fetching concerns or external dependencies.
- `application/` — use case classes, repository interfaces (port), and unit tests for use cases; no infrastructure concerns
- `infrastructure/` — concrete repository implementations and in-memory implementations.

### Dependency flow (packages/core)

```
shared kernel  ──►  domain  ──►  application  ──►  infrastructure
```

| Layer             | May import from                                                          | Must never import from            |
| ----------------- | ------------------------------------------------------------------------ | --------------------------------- |
| `domain/`         | shared kernel (`AppError`, `Result`) only                                | `application/`, `infrastructure/` |
| `application/`    | `domain/`, shared kernel                                                 | `infrastructure/`                 |
| `infrastructure/` | `domain/`, `application/` (to implement repository ports), shared kernel | —                                 |

## Commands

```bash
# Development
pnpm dev              # start all apps (Turborepo)
pnpm build            # build all apps and packages
pnpm test             # run all tests
pnpm lint             # lint all packages
pnpm format           # prettier format

# Per-app
pnpm --filter @codex/web dev        # Vite dev server
pnpm --filter @codex/web test       # Vitest (run once)
pnpm --filter @codex/web test:watch # Vitest watch
pnpm --filter @codex/api dev        # NestJS watch mode
pnpm --filter @codex/api test       # Vitest

# Single test file
pnpm --filter @codex/web exec vitest run src/domain/card-catalog/application/__tests__/get-cards.spec.ts
```

### Result pattern

Repositories and gateways return `Promise<Result<T, E>>`. `try/catch` lives **only** in infrastructure adapters (Repository implementation, API gateway, Prisma adapter). The application layer and thunks propagate `Result` without try/catch; thunks use `rejectWithValue` to surface errors.

```ts
// packages/shared
type Result<T, E extends AppError> = { ok: true; value: T } | { ok: false; error: E };
const ok = <T>(v: T) => ({ ok: true, value: v });
const err = <E>(e: E) => ({ ok: false, error: e });
```

## Code conventions

**Style**

- Arrow functions everywhere: `const fn = () => {}` — never `function fn()`.
- File names: `{entity}.{implementation}.{type}.ts` — e.g. `card.api.gateway.ts`, `card-catalog.fab.repository.ts`.
- Split in-memory and real implementations into separate files.
- Data-fetching interfaces are _Gateways_ (`ICardGateway`)
- Domain constants use `as const` objects, not TypeScript `enum`. Avoid using magic strings and use domain objects instead.

**View models** — extract derived/display logic from components into a co-located `*.view-model.ts` file exporting a `use*ViewModel` hook. Keeps components as pure render functions.

**AppThunk** — use the `AppThunk<R>` type alias (from `domain/store/app-thunk.ts`) for manually-created thunks. For async thunks use `createAppAsyncThunk` (re-exported from `domain/store/index.ts`) so `ThunkDependencies` are typed automatically.

**Selectors live in `domain/{context}/domain/`** for pure derivations (no filtering/sorting) and in `features/{feature}/use-cases/{use-case}/` for presentation selectors that combine domain state with display logic (e.g. `selectVisibleCards`, `selectCardWithActivePrinting`).

## Testing conventions

Never use class/function names or any technical terms as describe / test labels. Even non-developers should be able to understand which behavior is tested just by reading the test.

### Backend (core package)

**Sociable unit tests** (`.spec.ts`, co-located in `__tests__/`):

- Test use case behavior end-to-end using in-memory repository implementations.
- Format: `test('Rule: <description>', ...)`
- One test per business rule: happy path and each error / edge case
- Fixture files expose `givenX()`, `whenY()`, `thenZ()`, etc.
- Builders: fluent `builder().withProp1('value').withProp2('value').build()` wrapping aggregate creation (or type)

**Integration tests** (`.integration.test.ts`, in `infrastructure/repositories/__tests__/`):

- One file per Prisma repository.
- Bootstrapped via Testcontainers + Prisma migrations.
- Seeded via Prisma Fabbrica factories (`UserFactory.create()`).
- Wrapped in transactions for rollback isolation (`wrapInTransaction(prisma, ...)`).
- Tests: correct return when found, null when not found, correct persistence after save.

### Frontend (apps/web)

**Store unit tests** (`.spec.ts`, co-located with slices/thunks):

- Format: given store in state A → dispatch action B → store should be in state C.
- Use `createTestStore()` with in-memory gateways. Preload state with `stateBuilder` helpers.
- `stateBuilder` is a fluent builder (`stateBuilder().withAllCards([...]).withClasses([...]).build()`).
- `stateBuilderProvider` wraps `stateBuilder` for test fixtures that need mutable state across multiple setup steps.
- `createTestStore()` returns extra helpers: `getActions()` (all dispatched actions), `getDispatchedUseCaseArgs(thunk)` (args passed to a specific thunk).
- Inject in-memory gateway implementations via extra argument (`InMemoryCardCatalogGateway`, `InMemorySearchGateway`, ...).
- Test selectors independently with known state shapes.
- No component rendering in these tests — pure Redux state verification.
- Selector should handle derived state (e.g. filtering) — therefore, they should be tested as well.

### Shared principles

- **D.A.M.P.** (Descriptive And Meaningful Phrases): fixture files and builders make test scenarios readable without reading implementation details.
- No tests for single methods in isolation — test the behavior of units as a whole.
- `createFixture()` in `domain/store/__tests__/create-fixture.ts` is the base factory for domain-specific fixtures. It wraps a builder function that receives a `StateBuilderProvider` and returns domain-specific helpers (`givenX()`, `whenY()`, `thenZ()`).
- Integration tests for gateways live in `domain/{context}/infrastructure/__tests__/` and are suffixed `.integration.ts`.
