import fs from 'node:fs';
import path from 'node:path';

import { bootstrapTestDB } from './setup-db';

const STATE_PATH = path.join(process.cwd(), '.test-db-state.json');
const ENV_PATH = path.join(process.cwd(), '.test-db.env');

export default async function globalSetup() {
  const boot = await bootstrapTestDB();

  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        containerId: boot.container.getId(),
        databaseUrl: boot.databaseUrl,
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(ENV_PATH, `DATABASE_URL=${boot.databaseUrl}\n`);

  return async () => {
    await boot.container.stop();
    fs.rmSync(STATE_PATH, { force: true });
    fs.rmSync(ENV_PATH, { force: true });
  };
}
