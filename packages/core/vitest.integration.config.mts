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
    globalSetup: [path.resolve(__dirname, '../orm/src/__tests__/global-setup.ts')],
  },
  resolve: {
    alias: [
      {
        find: '@codex/orm/__tests__',
        replacement: path.resolve(__dirname, '../orm/src/__tests__'),
      },
      {
        find: '@codex/orm',
        replacement: path.resolve(__dirname, '../orm/src/index.ts'),
      },
    ],
  },
});
