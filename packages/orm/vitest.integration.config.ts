import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.integration.test.ts'],
    globals: true,
    passWithNoTests: true,
    testTimeout: 60000,
  },
});
