const base = require('./base');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  ...base.slice(0, -1),
  {
    ...base[0],
    rules: {
      ...base[0].rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  base[base.length - 1],
];
