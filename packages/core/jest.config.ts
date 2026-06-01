import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@codex/orm$': '<rootDir>/../../orm/src/index.ts',
    '^@codex/shared$': '<rootDir>/../../shared/src/index.ts',
  },
};

export default config;
