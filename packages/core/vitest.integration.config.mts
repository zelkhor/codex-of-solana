import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.integration.test.ts'],
    globals: true,
    passWithNoTests: true,
    testTimeout: 60000,
  },
  resolve: {
    alias: {
      '@codex/orm': path.resolve(__dirname, '../orm/src/index.ts'),
    },
  },
});
