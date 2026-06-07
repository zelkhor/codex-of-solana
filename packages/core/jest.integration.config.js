/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/integration.base'),
  displayName: 'Core - Integration test',
  rootDir: 'src',
  moduleNameMapper: {
    '^@codex/orm$': '<rootDir>/../../orm/src/index.ts',
  },
};

module.exports = config;
