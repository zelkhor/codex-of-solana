const reactConfig = require('@codex/config/eslint/react');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  ...reactConfig,

  // ── Architecture boundaries ──────────────────────────────────────────────────
  //
  // Layer order (each layer can only import from layers above it):
  //   external packages → shared/ui → shared → domain → features
  //
  // Within domain, sub-layers flow downward only:
  //   domain/X/domain → domain/X/application → domain/X/infrastructure
  //
  // Within features, use-cases are isolated from each other:
  //   pages can import from any use-case in the same feature
  //   use-cases can only import from the same use-case (relative) and feature ui
  //
  // Test files are exempt — they are the assembly layer.

  // shared/ui: no domain or feature imports
  {
    files: ['src/shared/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/domain/**'], message: 'shared/ui cannot import from domain/' },
            { group: ['@/features/**'], message: 'shared/ui cannot import from features/' },
          ],
        },
      ],
    },
  },

  // shared (excluding ui): no feature imports
  {
    files: ['src/shared/**'],
    ignores: ['src/shared/ui/**', 'src/shared/**/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/**'], message: 'shared/ cannot import from features/' },
          ],
        },
      ],
    },
  },

  // domain: no feature imports
  {
    files: ['src/domain/**'],
    ignores: ['src/domain/**/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/**'], message: 'domain/ cannot import from features/' },
          ],
        },
      ],
    },
  },

  // domain/X/domain: cannot import from its own application or infrastructure
  {
    files: ['src/domain/*/domain/**'],
    ignores: ['src/domain/*/domain/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domain/*/application/**'],
              message: 'domain layer cannot import from application layer — dependency flows downward only',
            },
            {
              group: ['@/domain/*/infrastructure/**'],
              message: 'domain layer cannot import from infrastructure layer — dependency flows downward only',
            },
          ],
        },
      ],
    },
  },

  // domain/X/application: cannot import from infrastructure
  {
    files: ['src/domain/*/application/**'],
    ignores: ['src/domain/*/application/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domain/*/infrastructure/**'],
              message: 'application layer cannot import from infrastructure layer — dependency flows downward only',
            },
          ],
        },
      ],
    },
  },

  // features: use-cases cannot import from sibling use-cases
  // Within a use-case, use relative imports. @/ imports must cross a layer boundary.
  {
    files: ['src/features/*/use-cases/**'],
    ignores: ['src/features/*/use-cases/**/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/use-cases/**'],
              message: 'A use-case cannot import from another use-case. Use relative imports within the same use-case.',
            },
          ],
        },
      ],
    },
  },

  // features: use-cases and feature-ui cannot access domain infrastructure
  {
    files: ['src/features/**'],
    ignores: ['src/features/**/__tests__/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domain/*/infrastructure/**'],
              message: 'features/ cannot import from domain infrastructure — use domain or application layer exports only',
            },
          ],
        },
      ],
    },
  },
];