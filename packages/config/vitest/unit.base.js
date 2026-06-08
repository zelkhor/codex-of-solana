/** @type {import('vitest/config').UserConfig['test']} */
const unitBase = {
  environment: 'node',
  include: ['**/__tests__/**/*.spec.ts'],
  globals: true,
  passWithNoTests: true,
};

module.exports = { unitBase };
