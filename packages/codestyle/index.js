const tsParser = require('@typescript-eslint/parser');
const checkFile = require('eslint-plugin-check-file');
const packageJsonConfig = require('eslint-plugin-package-json');
const perfectionist = require('eslint-plugin-perfectionist');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const regexpPlugin = require('eslint-plugin-regexp');
const { globalIgnores } = require('eslint/config');
const globals = require('globals');
const { existsSync } = require('node:fs');
const path = require('node:path');
const eslintTs = require('typescript-eslint');
const { isObject, isString } = require('valid-types');

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
  'example/*',
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
  const root = process.cwd();

  const packageJsonPath = path.resolve(root, 'package.json');
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  const { hasReact, reactNewSyntax } =
    packageJson && isObject(packageJson.dependencies) && isString(packageJson.dependencies.react);

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
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['UPPER_CASE', 'StrictPascalCase'],
          selector: 'interface',
        },
        {
          format: ['PascalCase'],
          selector: 'typeLike',
        },
        {
          format: ['UPPER_CASE', 'StrictPascalCase'],
          selector: 'class',
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
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
      'no-alert': 'error',
      'no-await-in-loop': 'off',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'no-warning-comments': 'warn',
    },
  };

  if (hasReact) {
    Object.assign(customTypescriptConfig.rules, {
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
    });
  }

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

  if (hasReact) {
    customTypescriptConfig.rules['react/jsx-uses-react'] = 'off';
    customTypescriptConfig.rules['react/react-in-jsx-scope'] = 'off';
  }

  return [
    globalIgnores(ignores),
    packageJsonConfig.configs.recommended,
    hasReact ? reactPlugin.configs.flat.recommended : {},
    ...recommendedTypeScriptConfigs,
    prettierRecommended,
    perfectionist.configs['recommended-natural'],
    regexpPlugin.configs['flat/recommended'],
    customTypescriptConfig,
    hasReact
      ? {
          settings: {
            react: {
              version: 'detect',
            },
          },
        }
      : {},
  ];
};
