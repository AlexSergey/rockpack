const { checkReact, getMode } = require('@rockpack/utils');
const tsParser = require('@typescript-eslint/parser');
const checkFile = require('eslint-plugin-check-file');
const json = require('eslint-plugin-json');
const perfectionist = require('eslint-plugin-perfectionist');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const regexpPlugin = require('eslint-plugin-regexp');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const globals = require('globals');
const { existsSync } = require('node:fs');
const path = require('node:path');
const eslintTs = require('typescript-eslint');

const ignores = [
  '**/*.d.ts',
  '*.d.ts',
  'node_modules',
  'logs',
  '*.log',
  'lib-cov/',
  'coverage/',
  'NO_COMMIT/',
  'test-reports/**',
  'docs/*',
  'build/*',
  'lib/*',
  'dist/*',
  '*.css',
  '*.scss',
  '*.less',
  '*.ico',
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.svg',
  '*.bmp',
  '*.gif',
  '*.webp',
  '*.woff',
  '*.woff2',
  '*.txt',
  '*.mdx',
  '*.md',
  '*.json',
  '*.ejs',
  '*.hbs',
  '*.jade',
  '*.html',
  'docs/',
  'public/',
  'locales/',
  'src/locales/',
  'seo_report',
];
const tsFiles = ['**/*.{ts,tsx}'];

module.exports.makeConfig = () => {
  const mode = getMode(['development', 'production'], 'production');
  const isDevelopment = mode === 'development';
  const root = process.cwd();

  const packageJsonPath = path.resolve(root, 'package.json');
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  const { hasReact, reactNewSyntax } = checkReact(packageJson);

  let tsConfig = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  const languageOptions = {
    ecmaVersion: 2024,
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    sourceType: 'module',
  };

  const customTypescriptConfig = {
    files: tsFiles,
    languageOptions: {
      ...languageOptions,
      parser: tsParser,
      parserOptions: {
        project: tsConfig || './tsconfig.json',
      },
    },
    plugins: {
      'check-file': checkFile,
      'import/parsers': tsParser,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': isDevelopment ? 'off' : 'error',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['UPPER_CASE', 'StrictPascalCase'],
          prefix: ['I'],
          selector: 'interface',
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': isDevelopment
        ? 'off'
        : [
            'error',
            {
              args: 'after-used',
              ignoreRestSiblings: false,
              vars: 'all',
            },
          ],
      '@typescript-eslint/return-await': 'off',

      camelcase: ['error', { properties: 'always' }],

      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],

      'class-methods-use-this': 'off',
      'newline-before-return': 'error',
      'no-alert': isDevelopment ? 'off' : 'error',
      'no-await-in-loop': 'off',
      'no-console': isDevelopment ? 'off' : 'error',
      'no-debugger': isDevelopment ? 'off' : 'error',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'no-warning-comments': 'warn',

      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      'unicorn/custom-error-definition': 'error',
      'unicorn/empty-brace-spaces': 'error',
      'unicorn/error-message': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/prefer-keyboard-event-key': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/throw-new-error': 'error',
    },
  };

  const recommendedTypeScriptConfigs = [
    ...eslintTs.configs.recommended.map((config) => ({
      ...config,
      files: tsFiles,
    })),
    ...eslintTs.configs.stylistic.map((config) => ({
      ...config,
      files: tsFiles,
    })),
  ];

  if (hasReact && reactNewSyntax) {
    customTypescriptConfig.rules['react/jsx-uses-react'] = 'off';
    customTypescriptConfig.rules['react/react-in-jsx-scope'] = 'off';
  }
  if (hasReact && !reactNewSyntax) {
    customTypescriptConfig.rules['@typescript-eslint/no-unused-vars'] = 'off';
    customTypescriptConfig.rules['no-unused-vars'] = 'off';
  }

  return [
    { ignores },
    reactPlugin.configs.flat.recommended,
    ...recommendedTypeScriptConfigs,
    prettierRecommended,
    perfectionist.configs['recommended-natural'],
    regexpPlugin.configs['flat/recommended'],
    json.configs['recommended'],
    customTypescriptConfig,
    {
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ];
};
