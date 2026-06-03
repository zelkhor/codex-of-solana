# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

`VITE_API_URL` — set in web `.env` to point at the API (defaults to `''` / same origin).

## Architecture

**Monorepo** managed with pnpm workspaces + Turborepo. Three layers:

```
packages/shared   — DTOs, Result type, constants, test builders (used by everyone)
packages/core     — domain + use cases + repository interfaces + implementations
packages/orm      — Prisma client re-export (consumers depend on @codex/orm, not @prisma/client)
apps/api          — NestJS, injects @codex/core use cases via DI
apps/web          — React 19 + Redux Toolkit + Vite, talks to API through gateways
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

Organised by bounded context (currently `card-catalog`):

- `domain/` — error types
- `application/` — use case classes, repository interfaces, fixture factories for tests
- `infrastructure/` — concrete repository implementations (`card-catalog.fab.repository.ts`, `card-catalog.inmemory.repository.ts`)

The FaB (Flesh and Blood) repository reads from the `@flesh-and-blood/cards` npm package and maps to `CardDto`. An in-memory repository is the standard test double.

### apps/api — NestJS

Each domain has a NestJS module. The module wires use cases to concrete repositories via `useFactory`. A global `DomainErrorFilter` converts thrown `AppError` instances into HTTP responses.

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

**Format**

```ts
describe('Feature: My feature description', () => {
  test('Rule: My rule explained in plain english', async () => { … });
});
```

Never use class/function names or any technical terms as describe / test labels. Even non-developers should be able to understand which behavior is tested just by reading the test.

**Test data** — always use test builders like `cardBuilder()` / `printingBuilder()` from `@codex/shared`:

```ts
const card = cardBuilder().withName('Ninja Strike').withPitch(CARD_PITCHES.Red).build();
```

**FE tests** — use `createTestStore()` from `__tests__/create-test-store.ts` to create a fake store implementation. To preload the store with an initial state, or to test your redux selectors you can use stateBuilder.

```ts
const card = cardBuilder().withCardIdentifier('ninja-strike-red').withName('Ninja Strike').build();
const store = createTestStore({ cardGateway: new InMemoryCardGateway([card]) });

store.dispatch(myAction());

expect(store.getState().state).toBe('whatever');
```

**Core tests** — use fixture factories (`createCardCatalogFixture`) that wire an in-memory repository and expose `given/when/then` helpers.

**Assertions** — avoid redundant count checks when `toEqual` on the full array already covers it.

**Infrastructure wrappers** (e.g. `HttpClient`) do not need tests.

## Packages

| Package         | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `@codex/shared` | DTOs, `Result`, domain constants, `cardBuilder`/`printingBuilder` |
| `@codex/core`   | Use cases, repository interfaces, concrete implementations        |
| `@codex/orm`    | Prisma client re-export                                           |
| `@codex/config` | Shared TypeScript config                                          |
| `@codex/web`    | React frontend                                                    |
| `@codex/api`    | NestJS backend                                                    |
