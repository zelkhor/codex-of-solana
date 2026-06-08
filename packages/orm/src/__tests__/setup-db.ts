import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'node:child_process';
import path from 'node:path';

const ormRoot = path.resolve(__dirname, '..', '..');

export type BootstrappedTestDB = {
  container: StartedPostgreSqlContainer;
  databaseUrl: string;
};

export const bootstrapTestDB = async (): Promise<BootstrappedTestDB> => {
  const container = await new PostgreSqlContainer('postgres:17').start();
  const databaseUrl = container.getConnectionUri();

  execSync('pnpm exec prisma migrate deploy', {
    cwd: ormRoot,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });

  return { container, databaseUrl };
};
