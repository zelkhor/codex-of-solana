import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    // <rootDir> resolves to apps/api/src/
    '^@codex/core$': '<rootDir>/../../../packages/core/src/index.ts',
  },
};

export default config;
