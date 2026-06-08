import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'node:fs';
import path from 'node:path';

import { initialize } from '../generated/fabbrica';
import { type Prisma, PrismaClient } from '../generated/prisma-client';

export type TransactionClient = Prisma.TransactionClient;

const STATE_PATH = path.join(process.cwd(), '.test-db-state.json');

const readDatabaseUrl = (): string => {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8')) as { databaseUrl: string };
  return state.databaseUrl;
};

export const createTestPrismaClient = (): PrismaClient =>
  new PrismaClient({ adapter: new PrismaPg({ connectionString: readDatabaseUrl() }) });

const ROLLBACK = Symbol('rollback');

/**
 * Runs the given test body inside a transaction that is always rolled back,
 * giving each test a clean, isolated database. Fabbrica is re-pointed at the
 * transaction client so seeded rows are part of the rollback too.
 */
export const wrapInTransaction = async (
  prisma: PrismaClient,
  run: (tx: TransactionClient) => Promise<void>,
): Promise<void> => {
  try {
    await prisma.$transaction(async (tx) => {
      // Fabbrica's initialize is typed for a full client; we deliberately pass
      // the transaction client so seeded rows roll back with the test.
      initialize({ prisma: tx as unknown as PrismaClient });
      await run(tx);
      throw ROLLBACK;
    });
  } catch (error) {
    if (error !== ROLLBACK) throw error;
  }
};
