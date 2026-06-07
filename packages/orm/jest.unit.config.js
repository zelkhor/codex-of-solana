/** @type {import('jest').Config} */
const config = {
  ...require('@codex/config/jest/unit.base'),
  displayName: 'ORM - Unit test',
  rootDir: 'src',
};

module.exports = config;
