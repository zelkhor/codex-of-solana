/** @type {import('vitest/config').UserConfig['test']} */
const integrationBase = {
  environment: 'node',
  include: ['**/__tests__/**/*.integration.test.ts'],
  globals: true,
  passWithNoTests: true,
  testTimeout: 60000,
};

module.exports = { integrationBase };
