# Plan 1: Monorepo Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing TypeScript stub into a fully configured Turborepo monorepo with a NestJS API shell, a React + Vite web shell, a shared types package, a core domain package skeleton, and a dedicated ORM package — everything building, linting, and ready for feature development in Plans 2–4.

**Architecture:** Turborepo orchestrates four packages (`config`, `shared`, `core`, `orm`) and two apps (`api`, `web`). `orm` owns the Prisma schema, migrations, generated client, factories, and testcontainers helpers — and re-exports `PrismaClient` and `Prisma` types from `@prisma/client`. `core` holds domain, application, and all repository implementations (in-memory + Prisma); it depends on `@codex/orm` for the Prisma client and never directly on `@prisma/client`. `apps/api` wires everything together via NestJS DI. The web store uses a `createStore` factory with `ThunkDependencies` DI and a `preloadedState` option — no dummy store instance.

**Dependency graph (no cycles):**

```
packages/shared  → (nothing internal)
packages/config  → (nothing internal)
packages/orm     → @prisma/client, @codex/shared
packages/core    → @codex/orm, @codex/shared, @flesh-and-blood/cards
apps/api         → @codex/core, @codex/orm, @codex/shared
apps/web         → @codex/shared
```

**Tech Stack:** Turborepo 2.9, pnpm 11.5, TypeScript 6.0, NestJS 11, React 19 + Vite 8, Redux Toolkit 2.12, Tailwind CSS 4 (Vite plugin), Prisma 7, Jest 30 + ts-jest (core/orm/api), Vitest 4 (web), ESLint 9 flat config, Prettier 3

---

## Implementation Notes (discovered during execution)

**Prisma 7 breaking changes:**

- `url = env("DATABASE_URL")` is no longer supported in `schema.prisma`. The datasource block only contains `provider`.
- Connection URL is now provided via `prisma.config.ts` using a driver adapter (`@prisma/adapter-pg` + `pg`).
- `packages/orm` needs `@prisma/adapter-pg ^7.8.0`, `pg ^8.21.0`, `@types/pg ^8.20.0` as additional dependencies.
- The `orm/src/index.ts` re-exports from `./generated/prisma-client` (the custom output path), NOT from `@prisma/client`.

**ESLint 9 flat config:**

- ESLint 9 uses flat config (`eslint.config.js`) not the legacy `.eslintrc.js` format. All per-package ESLint configs are `eslint.config.js` files exporting flat config arrays.
- `apps/web` uses `eslint.config.cjs` because it has `"type": "module"`.
- The `packages/config/eslint/*.js` files export flat config arrays, not `module.exports` objects.

**TypeScript 6:**

- `moduleResolution: "node"` is deprecated in TS 6. Add `"ignoreDeprecations": "6.0"` to `typescript/base.json`.

**Jest / Vitest:**

- Jest needs `--passWithNoTests` flag when there are no test files yet.
- Vitest needs `passWithNoTests: true` in vitest.config.ts test options.

**shadcn/ui (Tailwind 4 + shadcn 4.9):**

- shadcn init adds several runtime deps: `@base-ui/react`, `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`, `tw-animate-css`, `@fontsource-variable/geist`.
- Move `shadcn` CLI to devDependencies after init.
- The `msw` transitive dependency needs `msw: true` in `pnpm-workspace.yaml` allowBuilds.

**Vite / TypeScript:**

- Create `apps/web/src/vite-env.d.ts` with `/// <reference types="vite/client" />` for CSS import type resolution.

---

## File Map

### Root

| File                  | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `turbo.json`          | Pipeline: build, test, lint, dev             |
| `pnpm-workspace.yaml` | Workspace globs                              |
| `package.json`        | Root scripts and shared devDeps              |
| `.prettierrc`         | Formatting rules                             |
| `.gitignore`          | Ignores: node_modules, dist, .env, generated |

### packages/config/

| File                     | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `package.json`           | Config package (no build step)                    |
| `typescript/base.json`   | Strict CommonJS TypeScript base                   |
| `typescript/nestjs.json` | Extends base + decorators + emitDecoratorMetadata |
| `typescript/react.json`  | Extends base + ESNext/DOM/JSX/bundler resolution  |
| `eslint/base.js`         | @typescript-eslint + prettier rules               |
| `eslint/nestjs.js`       | Extends base, relaxes NestJS-specific rules       |
| `eslint/react.js`        | Extends base + react + react-hooks plugins        |

### packages/shared/

| File            | Purpose                                      |
| --------------- | -------------------------------------------- |
| `package.json`  | Shared package — imported as `@codex/shared` |
| `tsconfig.json` | Extends config/typescript/base               |
| `.eslintrc.js`  | Uses config/eslint/base                      |
| `src/index.ts`  | Empty barrel — DTOs added in Plans 2–4       |

### packages/core/

| File                        | Purpose                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `package.json`              | Depends on `@codex/orm` (for PrismaClient), `@codex/shared`, `@flesh-and-blood/cards` |
| `tsconfig.json`             | Extends config/typescript/base (no decorator flags needed)                            |
| `jest.config.ts`            | ts-jest for `.spec.ts` and `.integration.test.ts`                                     |
| `.eslintrc.js`              | Uses config/eslint/base                                                               |
| `src/index.ts`              | Empty barrel — slice exports added in Plans 2–4                                       |
| `src/user/.gitkeep`         | Empty placeholder                                                                     |
| `src/collection/.gitkeep`   | Empty placeholder                                                                     |
| `src/card-catalog/.gitkeep` | Empty placeholder                                                                     |

### packages/orm/

| File                      | Purpose                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `package.json`            | Depends on `@prisma/client`, `@codex/shared`; re-exports PrismaClient for consumers |
| `tsconfig.json`           | Extends config/typescript/base                                                      |
| `jest.config.ts`          | ts-jest — integration tests use testcontainers (added Plans 2–4)                    |
| `.eslintrc.js`            | Uses config/eslint/base                                                             |
| `prisma/schema.prisma`    | Datasource + generator (no models yet)                                              |
| `src/index.ts`            | Empty barrel — Prisma repos added in Plans 2–4                                      |
| `src/user/.gitkeep`       | Empty placeholder                                                                   |
| `src/collection/.gitkeep` | Empty placeholder                                                                   |

### apps/api/

| File                | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `package.json`      | NestJS 11 deps; depends on `@codex/core` and `@codex/orm` |
| `tsconfig.json`     | Extends config/typescript/nestjs                          |
| `nest-cli.json`     | NestJS build config                                       |
| `jest.config.ts`    | ts-jest for NestJS tests                                  |
| `.eslintrc.js`      | Uses config/eslint/nestjs                                 |
| `src/app.module.ts` | Root NestJS module                                        |
| `src/main.ts`       | Bootstrap entry point (port 3001)                         |

### apps/web/

| File                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `package.json`       | React 19 + Vite 8 + Redux + Tailwind 4 deps                      |
| `tsconfig.json`      | Extends config/typescript/react + `@` path alias                 |
| `tsconfig.node.json` | TS config for vite.config.ts / vitest.config.ts                  |
| `vite.config.ts`     | Vite + React plugin + Tailwind 4 Vite plugin + `@` alias + proxy |
| `vitest.config.ts`   | Vitest 4 + jsdom for store tests                                 |
| `.eslintrc.js`       | Uses config/eslint/react                                         |
| `index.html`         | Vite HTML entry                                                  |
| `src/index.css`      | `@import "tailwindcss"` — Tailwind 4 entry                       |
| `src/test-setup.ts`  | @testing-library/jest-dom matchers                               |
| `src/main.tsx`       | React entry — mounts Provider + App                              |
| `src/App.tsx`        | Root component (placeholder)                                     |
| `src/store/types.ts` | ThunkDependencies, ISearchService                                |
| `src/store/index.ts` | createStore factory with rootReducer + preloadedState            |

---

## Tasks

### Task 1: Configure the root monorepo

**Files:**

- Modify: `package.json`
- Create: `turbo.json`
- Create: `pnpm-workspace.yaml`
- Modify: `.prettierrc`
- Modify: `.gitignore`

- [ ] **Delete the existing `src/` directory** — it is a hello-world stub.

- [ ] **Replace `package.json`:**

```json
{
  "name": "codex-of-solana",
  "private": true,
  "packageManager": "pnpm@11.5.0",
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\" --ignore-path .gitignore"
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "turbo": "^2.9.16",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Create `pnpm-workspace.yaml`:**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Create `turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Replace `.prettierrc`:**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] **Replace `.gitignore`:**

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Prisma generated client
packages/orm/src/generated/

# Turbo cache
.turbo/

# Misc
*.log
.DS_Store
coverage/
```

---

### Task 2: Create the config package

**Files:**

- Create: `packages/config/package.json`
- Create: `packages/config/typescript/base.json`
- Create: `packages/config/typescript/nestjs.json`
- Create: `packages/config/typescript/react.json`
- Create: `packages/config/eslint/base.js`
- Create: `packages/config/eslint/nestjs.js`
- Create: `packages/config/eslint/react.js`

- [ ] **Create `packages/config/package.json`:**

```json
{
  "name": "@codex/config",
  "version": "0.0.1",
  "private": true,
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.2"
  }
}
```

- [ ] **Create `packages/config/typescript/base.json`:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

- [ ] **Create `packages/config/typescript/nestjs.json`:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

- [ ] **Create `packages/config/typescript/react.json`:**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": true
  }
}
```

- [ ] **Create `packages/config/eslint/base.js`:**

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: { node: true },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
};
```

- [ ] **Create `packages/config/eslint/nestjs.js`:**

```js
const base = require('./base');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  rules: {
    ...base.rules,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

- [ ] **Create `packages/config/eslint/react.js`:**

```js
const base = require('./base');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [...(base.extends ?? []), 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: [...(base.plugins ?? []), 'react', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  rules: {
    ...base.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
```

---

### Task 3: Create the shared package

**Files:**

- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/.eslintrc.js`
- Create: `packages/shared/src/index.ts`

- [ ] **Create `packages/shared/package.json`:**

```json
{
  "name": "@codex/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint \"src/**/*.ts\""
  },
  "devDependencies": {
    "@codex/config": "workspace:*",
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Create `packages/shared/tsconfig.json`:**

```json
{
  "extends": "@codex/config/typescript/base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Create `packages/shared/.eslintrc.js`:**

```js
module.exports = require('@codex/config/eslint/base');
```

- [ ] **Create `packages/shared/src/index.ts`:**

```ts
// Shared DTOs and Zod schemas exported from here.
// Populated in Plans 2–4.
export type {};
```

---

### Task 4: Create the core package skeleton

`core` holds domain entities, use cases, repository interfaces, in-memory repository implementations, and Prisma repository implementations. It depends on `@codex/orm` for the Prisma client — never directly on `@prisma/client`.

**Files:**

- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/jest.config.ts`
- Create: `packages/core/.eslintrc.js`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/src/user/.gitkeep`
- Create: `packages/core/src/collection/.gitkeep`
- Create: `packages/core/src/card-catalog/.gitkeep`

- [ ] **Create `packages/core/package.json`:**

```json
{
  "name": "@codex/core",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "lint": "eslint \"src/**/*.ts\"",
    "test": "jest"
  },
  "dependencies": {
    "@codex/orm": "workspace:*",
    "@codex/shared": "workspace:*",
    "@flesh-and-blood/cards": "^3.9.2",
    "@flesh-and-blood/types": "^3.8.24"
  },
  "devDependencies": {
    "@codex/config": "workspace:*",
    "@types/jest": "^29.5.13",
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "jest": "^30.4.2",
    "ts-jest": "^29.4.11",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Create `packages/core/tsconfig.json`:**

```json
{
  "extends": "@codex/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.integration.test.ts"]
}
```

- [ ] **Create `packages/core/jest.config.ts`:**

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    // <rootDir> resolves to packages/core/src/ — go up two levels to reach packages/
    '^@codex/orm$': '<rootDir>/../../orm/src/index.ts',
    '^@codex/shared$': '<rootDir>/../../shared/src/index.ts',
  },
};

export default config;
```

- [ ] **Create `packages/core/.eslintrc.js`:**

```js
module.exports = require('@codex/config/eslint/base');
```

- [ ] **Create `packages/core/src/index.ts`:**

```ts
// Vertical slice exports added here as Plans 2–4 populate each slice.
export type {};
```

- [ ] **Create empty `.gitkeep` files** to preserve the directory structure:
  - `packages/core/src/user/.gitkeep`
  - `packages/core/src/collection/.gitkeep`
  - `packages/core/src/card-catalog/.gitkeep`

---

### Task 5: Create the ORM package skeleton

`orm` owns the Prisma schema, migrations, generated client, Prisma Fabbrica factories, and testcontainers helpers. It re-exports `PrismaClient` and `Prisma` types so that `@codex/core` never depends on `@prisma/client` directly. It has no dependency on `@codex/core` — no cycles.

**Files:**

- Create: `packages/orm/package.json`
- Create: `packages/orm/tsconfig.json`
- Create: `packages/orm/jest.config.ts`
- Create: `packages/orm/.eslintrc.js`
- Create: `packages/orm/src/index.ts`
- Create: `packages/orm/src/user/.gitkeep`
- Create: `packages/orm/src/collection/.gitkeep`
- Create: `packages/orm/prisma/schema.prisma`
- Create: `packages/orm/.env`

- [ ] **Create `packages/orm/package.json`:**

```json
{
  "name": "@codex/orm",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "prisma": {
    "schema": "./prisma/schema.prisma"
  },
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "lint": "eslint \"src/**/*.ts\"",
    "test": "jest",
    "db:generate": "prisma generate --schema ./prisma/schema.prisma",
    "db:migrate": "prisma migrate dev --schema ./prisma/schema.prisma"
  },
  "dependencies": {
    "@codex/shared": "workspace:*",
    "@prisma/client": "^7.8.0"
  },
  "devDependencies": {
    "@codex/config": "workspace:*",
    "@types/jest": "^29.5.13",
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "jest": "^30.4.2",
    "prisma": "^7.8.0",
    "ts-jest": "^29.4.11",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Create `packages/orm/tsconfig.json`:**

```json
{
  "extends": "@codex/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "src/generated", "**/*.spec.ts", "**/*.integration.test.ts"]
}
```

- [ ] **Create `packages/orm/jest.config.ts`:**

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  // Integration tests only — unit tests for domain logic live in packages/core
  testMatch: ['**/__tests__/**/*.integration.test.ts'],
  moduleNameMapper: {
    // <rootDir> resolves to packages/orm/src/
    '^@codex/shared$': '<rootDir>/../../shared/src/index.ts',
  },
};

export default config;
```

- [ ] **Create `packages/orm/.eslintrc.js`:**

```js
module.exports = require('@codex/config/eslint/base');
```

- [ ] **Create `packages/orm/src/index.ts`:**

```ts
// Re-export the Prisma client and types so consumers depend on @codex/orm,
// not directly on @prisma/client. Prisma repository implementations in
// @codex/core import PrismaClient from here.
export { PrismaClient } from '@prisma/client';
export type { Prisma } from '@prisma/client';

// Factories and testcontainers helpers are exported here in Plans 2–4.
```

- [ ] **Create empty `.gitkeep` files:**
  - `packages/orm/src/user/.gitkeep`
  - `packages/orm/src/collection/.gitkeep`

- [ ] **Create `packages/orm/prisma/schema.prisma`:**

```prisma
// Models are added incrementally in Plans 2–4.

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma-client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Create `packages/orm/.env`** (not committed — already in `.gitignore`):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex_of_solana?schema=public"
```

Update the credentials to match your local PostgreSQL instance. Create the database if it doesn't exist: `createdb codex_of_solana`.

---

### Task 6: Create the API app shell

**Files:**

- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/nest-cli.json`
- Create: `apps/api/jest.config.ts`
- Create: `apps/api/.eslintrc.js`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/main.ts`

- [ ] **Create `apps/api/package.json`:**

```json
{
  "name": "@codex/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "lint": "eslint \"src/**/*.ts\"",
    "test": "jest"
  },
  "dependencies": {
    "@codex/core": "workspace:*",
    "@codex/orm": "workspace:*",
    "@codex/shared": "workspace:*",
    "@nestjs/common": "^11.1.24",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.1.24",
    "@nestjs/platform-express": "^11.1.24",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@codex/config": "workspace:*",
    "@nestjs/cli": "^11.0.21",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.1.24",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.13",
    "@types/node": "^22.5.4",
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "jest": "^30.4.2",
    "ts-jest": "^29.4.11",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Create `apps/api/tsconfig.json`:**

```json
{
  "extends": "@codex/config/typescript/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "."
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

- [ ] **Create `apps/api/nest-cli.json`:**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Create `apps/api/jest.config.ts`:**

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    // <rootDir> resolves to apps/api/src/
    '^@codex/core$': '<rootDir>/../../../packages/core/src/index.ts',
    '^@codex/orm$': '<rootDir>/../../../packages/orm/src/index.ts',
    '^@codex/shared$': '<rootDir>/../../../packages/shared/src/index.ts',
  },
};

export default config;
```

- [ ] **Create `apps/api/.eslintrc.js`:**

```js
module.exports = require('@codex/config/eslint/nestjs');
```

- [ ] **Create `apps/api/src/app.module.ts`:**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
```

- [ ] **Create `apps/api/src/main.ts`:**

```ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
```

---

### Task 7: Create the web app shell

Tailwind 4 uses a Vite-native plugin — no `tailwind.config.js` or `postcss.config.js` required. Configuration is done in CSS using `@theme`.

**Files:**

- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tsconfig.node.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/.eslintrc.js`
- Create: `apps/web/index.html`
- Create: `apps/web/src/index.css`
- Create: `apps/web/src/test-setup.ts`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/store/types.ts`
- Create: `apps/web/src/store/index.ts`

- [ ] **Create `apps/web/package.json`:**

```json
{
  "name": "@codex/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@codex/shared": "workspace:*",
    "@reduxjs/toolkit": "^2.12.0",
    "@tanstack/react-virtual": "^3.13.26",
    "fuse.js": "^7.4.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-redux": "^9.3.0"
  },
  "devDependencies": {
    "@codex/config": "workspace:*",
    "@tailwindcss/vite": "^4.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^22.5.4",
    "@types/react": "^19.2.15",
    "@types/react-dom": "^19.2.3",
    "@typescript-eslint/eslint-plugin": "^8.5.0",
    "@typescript-eslint/parser": "^8.5.0",
    "@vitejs/plugin-react": "^6.0.2",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "jsdom": "^25.0.0",
    "tailwindcss": "^4.3.0",
    "typescript": "^6.0.3",
    "vite": "^8.0.14",
    "vitest": "^4.1.7"
  }
}
```

- [ ] **Create `apps/web/tsconfig.json`:**

```json
{
  "extends": "@codex/config/typescript/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Create `apps/web/tsconfig.node.json`:**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Create `apps/web/vite.config.ts`:**

```ts
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Create `apps/web/vitest.config.ts`:**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
});
```

- [ ] **Create `apps/web/.eslintrc.js`:**

```js
module.exports = require('@codex/config/eslint/react');
```

- [ ] **Create `apps/web/index.html`:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Codex of Solana</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Create `apps/web/src/index.css`:**

```css
@import 'tailwindcss';
```

- [ ] **Create `apps/web/src/test-setup.ts`:**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Create `apps/web/src/store/types.ts`:**

```ts
export interface ISearchService {
  index(items: unknown[]): void;
  search(query: string): unknown[];
}

// cardService, collectionService and authService are typed as unknown here.
// Each plan replaces them with a real typed interface as the feature is built.
export interface ThunkDependencies {
  cardService: unknown;
  collectionService: unknown;
  authService: unknown;
  searchService: ISearchService;
}
```

- [ ] **Create `apps/web/src/store/index.ts`:**

```ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { ThunkDependencies } from './types';

// rootReducer is defined here so RootState can be derived without a store instance.
// Slices are added to this object in Plans 2–4.
const rootReducer = combineReducers({
  // slices added here in Plans 2–4
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(dependencies: ThunkDependencies, preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        // Fuse.js instances are non-serializable — disable the check globally.
        serializableCheck: false,
      }),
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
```

- [ ] **Create `apps/web/src/App.tsx`:**

```tsx
export function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Codex of Solana</h1>
    </div>
  );
}
```

- [ ] **Create `apps/web/src/main.tsx`:**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { createStore } from './store';
import './index.css';

const store = createStore({
  cardService: {},
  collectionService: {},
  authService: {},
  searchService: { index: () => {}, search: () => [] },
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

---

### Task 8: Initialize shadcn/ui

shadcn modifies `src/index.css` (adds CSS variable definitions) and creates `src/lib/utils.ts`. Initialize it before those files are built upon in later plans.

**Run from `apps/web/`** after `pnpm install` has been run (Task 9):

- [ ] **Run the shadcn init command:**

```bash
cd apps/web && npx shadcn@latest init
```

When prompted:

- Style: **New York**
- Base color: **Slate**
- CSS variables: **Yes**

Expected output: `components.json` created, `src/index.css` updated with CSS variable definitions, `src/lib/utils.ts` created with the `cn()` helper.

- [ ] **Verify `apps/web/components.json` was created** and contains `"rsc": false` and `"tsx": true`.

- [ ] **Verify `apps/web/src/lib/utils.ts` was created:**

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

If the file is missing, create it manually. Also install the two dependencies shadcn adds if they are not already in `package.json`:

```bash
pnpm --filter @codex/web add clsx tailwind-merge
```

---

### Task 9: Install dependencies and generate the Prisma client

- [ ] **Install all workspace dependencies** from the repo root:

```bash
pnpm install
```

Expected: all packages resolved, local workspace packages linked, no errors.

- [ ] **Generate the Prisma client** (run from `packages/orm/`):

```bash
pnpm --filter @codex/orm db:generate
```

Expected: `packages/orm/src/generated/prisma-client/` created. No models yet so only the base client is generated. No errors.

---

### Task 10: Verify the build, lint, and dev servers

- [ ] **Build all packages in dependency order:**

```bash
pnpm build
```

Expected: all packages build without errors (config → shared → core → orm → api/web).

- [ ] **Run lint across all packages:**

```bash
pnpm lint
```

Expected: zero lint errors.

- [ ] **Run tests to confirm the test runners are wired up:**

```bash
pnpm test
```

Expected: Jest exits cleanly for `@codex/core`, `@codex/orm`, and `@codex/api` (no test files found, no crash). Vitest exits cleanly for `@codex/web`.

- [ ] **Boot the API** and confirm it starts:

```bash
pnpm --filter @codex/api dev
```

Expected output:

```
API running on http://localhost:3001/api
```

Stop with `Ctrl+C`.

- [ ] **Boot the web dev server** and open `http://localhost:3000`:

```bash
pnpm --filter @codex/web dev
```

Expected: browser renders "Codex of Solana" heading with Tailwind styles applied.

Stop with `Ctrl+C`.
