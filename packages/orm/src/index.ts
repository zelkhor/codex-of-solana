// Re-export the Prisma client and types so consumers depend on @codex/orm,
// not directly on @prisma/client. Prisma repository implementations in
// @codex/core import PrismaClient from here.
export { PrismaClient } from './generated/prisma-client';
export type { Prisma } from './generated/prisma-client';

// Factories and testcontainers helpers are exported here in Plans 2–4.
