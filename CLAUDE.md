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
| Card metadata      | `@flesh-and-blood/cards` + `@flesh-and-blood/types`      |
| Fuzzy search       | Fuse.js (client-side, injected via Redux extra argument) |

## Monorepo Structure

```
codex-of-solana/
├── apps/
│   ├── api/                          # NestJS backend
│   └── web/                          # React frontend
├── packages/
│   ├── config/                       # Shared ESLint, TS, Prettier configs
│   ├── core/                         # Domain + Application + Infrastructure and shared kernel (e.g. AppError)
│   └── orm/                          # Prisma schema, client re-export, fabbrica factories, migrations
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Principles:**

- `core` Contains domain logic, use cases, repository interfaces, and concrete implementations. Should not depend on any web or API concerns. Also contains shared kernel types like `AppError` and `Result`.
- `apps/api` wires NestJS DI and imports use cases from `core`.
- `apps/web` imports only from `shared` for API types, never from `core` directly.

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
pnpm --filter @codex/api test       # Jest

# Single test file
pnpm --filter @codex/web exec vitest run src/store/card-catalog/__tests__/card-catalog.spec.ts
```

### Result pattern

Repositories and gateways return `Promise<Result<T, E>>`. `try/catch` lives **only** in infrastructure adapters (Repository implementation, API gateway, Prisma adapter). The application layer and thunks propagate `Result` without try/catch; thunks use `rejectWithValue` to surface errors.

```ts
// packages/shared
type Result<T, E extends AppError> = { ok: true; value: T } | { ok: false; error: E };
const ok = <T>(v: T) => ({ ok: true, value: v });
const err = <E>(e: E) => ({ ok: false, error: e });
```

### packages/core — domain layer

Organised by bounded context :

- `domain/` — error types and aggregate roots (e.g. `Card`, `Printing`) with domain logic and invariants; no data-fetching concerns
- `application/` — use case classes, repository interfaces and unit test for use cases; no infrastructure concerns
- `infrastructure/` — concrete repository implementations (`card-catalog.fab.repository.ts`, `card-catalog.inmemory.repository.ts`)

The FaB (Flesh and Blood) repository reads from the `@flesh-and-blood/cards` npm package and maps to `Card`. An in-memory repository is the standard test double.

### apps/api — NestJS

Each domain has a NestJS module. The module wires use cases to concrete repositories via `useFactory`. A global `HttpError` converts thrown `AppError` instances into HTTP responses.

### apps/web — Redux + Gateway pattern

State is managed with Redux Toolkit. Thunks receive **gateway** dependencies (`ThunkDependencies`) injected at store creation — never imported directly.

- `store/` — slices, selectors, thunks; `async-status.ts` holds `ASYNC_STATUS` as-const enum
- `gateways/` — `I{Name}Gateway` interface + `{name}.api.gateway.ts` (real) + `{name}.inmemory.gateway.ts` (test double); HTTP done through `HttpClient` wrapper
- `components/{feature}/` — each feature folder may have a `*.view-model.ts` that extracts business logic out of the component as a pure hook
- `hooks/useDebounced.ts` — debounce hook used for search inputs

**Store creation** (`main.tsx`) wires real gateways. **Test store** (`__tests__/create-test-store.ts`) swaps them for in-memory doubles.

## Code conventions

**Style**

- Arrow functions everywhere: `const fn = () => {}` — never `function fn()`.
- File names: `{entity}.{implementation}.{type}.ts` — e.g. `card.api.gateway.ts`, `card-catalog.fab.repository.ts`.
- Split in-memory and real implementations into separate files.
- Data-fetching interfaces are _Gateways_ (`ICardGateway`)
- Domain constants use `as const` objects, not TypeScript `enum`. Avoid using magic strings and use domain objects instead.

**View models** — extract derived/display logic from components into a co-located `*.view-model.ts` file exporting a `use*ViewModel` hook. Keeps components as pure render functions.

**AppThunk** — use the `AppThunk<R>` type alias (from `store/app-thunk.ts`) for manually-created thunks instead of spelling out the full `ThunkAction` signature.

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
- Stores are often preloaded with an explicit initial state to set up the scenario before dispatching actions. Use createTestStore() with in-memory gateways to set up the initial state. Use stateBuilder helpers to construct complex state shapes.
- Inject in-memory implementations of all gateway interfaces via extra argument (e.g. `InMemorySearchGateway`, `InMemoryCardGateway`, ...).
- Test selectors independently with known state shapes.
- No component rendering in these tests — pure Redux state verification.
- Also uses fixture files and builders for readability, but focused on the store shape and dispatched actions rather than domain rules.
- Selector should handle derived state (e.g. filtering) — therefore, they should be tested as well

### Shared principles

- **D.A.M.P.** (Descriptive And Meaningful Phrases): fixture files and builders make test scenarios readable without reading implementation details.
- No tests for single methods in isolation — test the behavior of units as a whole.
- Base `createFixture()` provides shared helpers (`thenErrorShouldBe`, etc.) extended by domain-specific fixtures.
