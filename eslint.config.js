import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vitest from '@vitest/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import testingLibrary from 'eslint-plugin-testing-library'
import jestDom from 'eslint-plugin-jest-dom'

export default defineConfigWithVueTs([
  {
    ignores: ['test/vitest/coverage/*'],
  },

  pluginQuasar.configs.recommended(),

  js.configs.recommended,

  pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.vue'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      'import/newline-after-import': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/order': [
        'error',
        { alphabetize: { order: 'asc', caseInsensitive: true } },
      ],
    },
  },

  vueTsConfigs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly', // BEX related
      },
    },
    rules: {
      'prefer-promise-reject-errors': 'off',

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  {
    files: ['src/**/*.spec.ts'],
    extends: [
      jestDom.configs['flat/recommended'],
      testingLibrary.configs['flat/vue'],
    ],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'off',
      'vitest/valid-title': ['error', { ignoreTypeOfDescribeName: true }],
      'testing-library/prefer-user-event': 'error',

      // Disable due to toBeCalled being flagged.
      '@typescript-eslint/unbound-method': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },

  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  prettierSkipFormatting,
])
