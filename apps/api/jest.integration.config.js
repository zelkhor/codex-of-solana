/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/integration.base'),
  displayName: 'Api - Integration test',
  rootDir: 'src',
  moduleNameMapper: {
    '^@codex/core$': '<rootDir>/../../../packages/core/src/index.ts',
  },
};

module.exports = config;
