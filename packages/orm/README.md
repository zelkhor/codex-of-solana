# @codex/orm

The data-access package: the Prisma schema, generated client, migrations, and the Prisma Fabbrica factories used to seed integration tests. Every other package/app imports the database client and types from here — `@codex/orm` never depends on another workspace package.

## What's inside

| Path                   | Purpose                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `prisma/schema.prisma` | Single source of truth for the database schema.                                                                                           |
| `prisma/migrations/`   | The ordered SQL migration history.                                                                                                        |
| `prisma.config.ts`     | Prisma CLI config. Loads `dotenv/config`, points the CLI at the schema, and feeds it `DATABASE_URL`.                                      |
| `src/client.ts`        | The shared `prisma` singleton — a `PrismaClient` backed by the `@prisma/adapter-pg` driver adapter.                                       |
| `src/index.ts`         | Public barrel: re-exports `prisma`, `PrismaClient`, the `Prisma` namespace, and the generated model types.                                |
| `src/generated/`       | Output of `prisma generate` — the typed client and the Fabbrica factories. **Git-ignored; must be generated before typecheck/build/run.** |
| `src/__tests__/`       | Integration-test plumbing: Testcontainers bootstrap, transaction wrapper, factories.                                                      |

The package is **consumed from source** — `main`/`types` point at `./src/index.ts`, not a build output. That's why `src/generated/` has to exist before anything that imports `@codex/orm` can typecheck or run. Turbo enforces this: `build`, `dev`, and the test tasks all declare `dependsOn: ["^db:generate"]`, so a normal `pnpm build` regenerates the client first. When you run a single package in isolation, generate it yourself (step 2 below).

## Configuration

The connection string lives in `packages/orm/.env` (copy `.env.example`):

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex_of_solana?sslmode=disable&schema=public"
```

`prisma.config.ts` calls `import 'dotenv/config'`, so every `prisma …` CLI command run from this package reads that `DATABASE_URL`. The runtime client (`src/client.ts`) reads the same `process.env.DATABASE_URL` and hands it to the pg adapter — there is **no `url` in the `datasource` block** of the schema; the URL is always supplied at runtime/CLI time, never hard-coded into the schema.

## Local database

A throwaway Postgres for local development and for running the seeding script lives in the repo-root `docker-compose.yml` (`postgres:17`, port `5432`, db `codex_of_solana`, user `postgres` / password `password`). Start it before any command that touches the DB:

```bash
docker compose up -d db        # from the repo root; Docker Desktop must be running
```

This is a **persistent** dev DB (data is kept in a Docker volume). It is unrelated to the integration tests, which spin up their own disposable Testcontainers Postgres.

## Commands

All commands are package scripts — run them with `pnpm --filter @codex/orm <script>`.

### `db:generate` → `prisma generate`

Reads `schema.prisma` and writes the typed client + Fabbrica factories into `src/generated/`. Run it after a fresh clone, after pulling schema changes, or any time `src/generated/` is missing. It does **not** touch the database — it only produces TypeScript.

### `db:migrate` → `prisma migrate dev`

The **development** migration command. Diffs the schema against the migration history, generates a new SQL migration for any change (it prompts for a name), applies every pending migration to the database in `DATABASE_URL`, and regenerates the client. Use this while evolving the schema. It will create/alter tables, so point it at a dev database only.

### `db:deploy` → `prisma migrate deploy`

The **non-interactive** apply command. Runs every pending migration in `prisma/migrations/` against the database and nothing else — it never generates new migrations and never prompts. This is what you run to bring an existing/empty database up to the current schema (CI, a fresh local DB, production-style deploys).

## Typical workflows

### Bring a fresh local DB up to date

```bash
docker compose up -d db                  # start Postgres (repo root)
pnpm --filter @codex/orm db:generate     # generate the client (if src/generated is missing)
pnpm --filter @codex/orm db:deploy       # apply existing migrations
```

### Run the reference-data seeding script against it

```bash
pnpm --filter @codex/fab-card-registry sync
```

The script is additive/idempotent — re-running only inserts rows that don't exist yet.

### Change the schema

```bash
# edit prisma/schema.prisma, then:
pnpm --filter @codex/orm db:migrate      # creates + applies a new migration, regenerates the client
```

### Inspect or reset the data

```bash
pnpm --filter @codex/orm exec prisma studio              # browse the DB in a GUI
pnpm --filter @codex/orm exec prisma migrate reset --force   # drop, recreate, re-apply all migrations
docker compose down -v                                   # delete the container + its volume entirely
```

## Tests

```bash
pnpm --filter @codex/orm test:unit          # pure unit tests, no database
pnpm --filter @codex/orm test:integration   # spins up a disposable Postgres via Testcontainers
```

Integration tests require Docker. They start their own `postgres:17` container, run `prisma migrate deploy` against it, seed via Fabbrica factories, and wrap each test in a transaction that is always rolled back for isolation — so they neither need nor touch the `docker-compose` dev database.
