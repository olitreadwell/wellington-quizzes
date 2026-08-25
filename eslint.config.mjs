import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsdoc from 'eslint-plugin-jsdoc';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Every exported function in the domain layer carries a doc comment,
  // so IDE hover and agent search explain it without opening the file.
  {
    plugins: { jsdoc },
    files: ['src/lib/**/*.ts', 'src/server/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
  },

  // Accessibility rules enforced explicitly so a broken interaction pattern
  // cannot be merged unnoticed.
  {
    rules: {
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': [
        'error',
        { controlComponents: ['Input'], assert: 'either', depth: 3 },
      ],
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/tabindex-no-positive': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  globalIgnores([
    '.next/**',
    'node_modules/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'dist/**',
  ]),
]);

export default eslintConfig;
