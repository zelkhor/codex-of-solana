import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.spec.ts'],
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@codex/orm': path.resolve(__dirname, '../../packages/orm/src/index.ts'),
    },
  },
});
