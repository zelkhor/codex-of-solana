import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.integration.test.ts'],
  moduleNameMapper: {
    // <rootDir> resolves to packages/orm/src/
  },
};

export default config;
