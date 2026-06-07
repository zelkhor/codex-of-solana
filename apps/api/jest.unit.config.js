/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/unit.base'),
  displayName: 'Api - Unit test',
  rootDir: 'src',
  moduleNameMapper: {
    '^@codex/core$': '<rootDir>/../../../packages/core/src/index.ts',
  },
};

module.exports = config;
