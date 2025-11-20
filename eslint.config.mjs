import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // TypeScript/ESLint base rules
      'eqeqeq': ['error', 'smart'],
      'space-before-function-paren': 'off',
      'semi': ['error', 'always'],
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
          overrides: {
            'if': { after: false },
            'for': { after: false },
            'while': { after: false },
            'switch': { after: false },
            'catch': { after: false },
            'new': { before: true },
            'return': { before: false },
            'from': { before: true, after: true },
            'import': { after: true },
            'case': { after: true },
            'this': { before: true },
            'throw': { after: true },
            'continue': { before: true },
            'default': { after: true },
            'export': { after: true },
            'as': { before: true }
          }
        }
      ],
      'no-var': 'error',
      'prefer-template': 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 0,
          maxBOF: 0
        }
      ],
      'eol-last': ['error', 'never'],
      'prefer-arrow-callback': [
        'warn',
        {
          allowNamedFunctions: false
        }
      ],
      'object-curly-spacing': [
        'error',
        'always',
        {
          objectsInObjects: false
        }
      ],
      'multiline-ternary': ['error', 'always-multiline'],
      'operator-linebreak': ['error', 'after'],
      'max-len': [
        'error',
        {
          code: 180,
          ignoreComments: true
        }
      ],
      'no-undef-init': 'off',
      'no-unused-expressions': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],
      'prefer-regex-literals': 'warn',
      
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
);

