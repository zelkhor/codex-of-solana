/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/integration.base'),
  displayName: 'ORM - Integration test',
  rootDir: 'src',
};

module.exports = config;
