/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/unit.base'),
  displayName: 'Core - Unit test',
  rootDir: 'src',
  moduleNameMapper: {
    '^@codex/orm$': '<rootDir>/../../orm/src/index.ts',
  },
};

module.exports = config;
