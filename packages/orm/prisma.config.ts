import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter(env: NodeJS.ProcessEnv) {
      const pool = new Pool({ connectionString: env['DATABASE_URL'] });
      return new PrismaPg(pool);
    },
  },
});
