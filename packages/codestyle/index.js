const { existsSync } = require('node:fs');
const path = require('node:path');

const createBabelPresets = require('@rockpack/babel');
const { checkReact, getMode } = require('@rockpack/utils');
const deepExtend = require('deep-extend');
const fs = require("fs");

module.exports.makeConfig = (customConfig = {}, opts = {}) => {
  if (!customConfig) {
    customConfig = {};
  }
  const mode = getMode(['development', 'production'], 'production');
  const isDevelopment = mode === 'development';
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const prettierrcPath = path.resolve(root, '.prettierrc');
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  let prettierConfig = {
    bracketSpacing: true,
    endOfLine: 'lf',
    printWidth: 120,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    useTabs: false,
  };
  if (existsSync(prettierrcPath)) {
    try {
      prettierConfig = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));
    } catch (err) {
      console.error(err);
    }
  }
  const ignoredPropNames = opts.ignoredPropNames || `^(${['Window'].join('|')})$`;
  const camelCaseAllow = opts.camelCaseAllow || [];
  const { hasReact, reactNewSyntax } = checkReact(packageJson);

  let tsConfig = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');

    if (opts.debug && existsSync(path.resolve(root, './tsconfig.debug.js'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.js');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');

    if (opts.debug && existsSync(path.resolve(root, './tsconfig.debug.json'))) {
      tsConfig = path.resolve(root, './tsconfig.debug.json');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  const jsExtends = hasReact
    ? [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'airbnb-base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:regexp/recommended',
      ]
    : [
        'eslint:recommended',
        'airbnb-base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:regexp/recommended',
      ];

  const tsExtends = hasReact
    ? [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:perfectionist/recommended-natural',
        'plugin:regexp/recommended',
      ]
    : [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:perfectionist/recommended-natural',
        'plugin:regexp/recommended',
      ];

  const jsPlugins = hasReact ?
    ['import', 'unicorn', 'react', 'react-hooks', 'check-file', 'jest-formatting', 'perfectionist', 'regexp'] :
    ['import', 'unicorn', 'check-file', 'jest-formatting', 'perfectionist', 'regexp'];

  const tsPlugins = hasReact
    ? ['@typescript-eslint', 'import', 'unicorn', 'react', 'react-hooks', 'check-file', 'jest-formatting', 'perfectionist', 'regexp']
    : ['@typescript-eslint', 'import', 'unicorn', 'check-file', 'jest-formatting', 'perfectionist', 'regexp'];

  const reactRules = {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // eslint-plugin-perfectionist conflicts
    // https://github.com/azat-io/eslint-plugin-perfectionist#%EF%B8%8F-troubleshooting
    'react/jsx-sort-props': 'off',
  };

  if (hasReact && reactNewSyntax) {
    reactRules['react/jsx-uses-react'] = 'off';
    reactRules['react/react-in-jsx-scope'] = 'off';
  }
  if (hasReact && !reactNewSyntax) {
    reactRules['@typescript-eslint/no-unused-vars'] = 'off';
    reactRules['no-unused-vars'] = 'off';
  }

  return deepExtend(
    {},
    {
      root: true,
      env: {
        browser: true,
        es6: true,
        jest: true,
        node: true,
      },
      globals: {
        createSerializer: true,
        global: true,
        globalThis: true,
        mount: true,
        mountToJson: true,
        render: true,
        renderToJson: true,
        shallow: true,
        shallowToJson: true,
      },
      ignorePatterns: ['.eslintrc.js', '.eslintrc.cjs'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            moduleDirectory: ['node_modules', 'src'],
          },
        },
        react: {
          version: 'detect',
        },
      },
      // eslint-plugin-perfectionist conflicts
      // https://github.com/azat-io/eslint-plugin-perfectionist#%EF%B8%8F-troubleshooting
      rules: {
        'import/order': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
      },
      overrides: [
        /*
          <-------------JS CONFIG------------->
        */
        {
          extends: jsExtends,
          files: ['*.js', '*.jsx'],
          parser: require.resolve('@babel/eslint-parser'),
          parserOptions: {
            babelOptions: createBabelPresets({
              framework: 'react',
            }),
            ecmaFeatures: {
              jsx: hasReact,
              modules: true,
              useJSXTextNode: hasReact,
            },
            ecmaVersion: 2018,
            requireConfigFile: false,
            sourceType: 'module',
          },
          plugins: jsPlugins,
        },
        /*
          <-------------TYPESCRIPT CONFIG------------->
        */
        {
          extends: tsExtends,
          files: ['*.ts', '*.tsx'],
          parser: require.resolve('@typescript-eslint/parser'),
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
            project: tsConfig || './tsconfig.json',
            sourceType: 'module',
            tsconfigRootDir: root,
          },
          plugins: tsPlugins,
          // eslint-plugin-perfectionist conflicts
          // https://github.com/azat-io/eslint-plugin-perfectionist#%EF%B8%8F-troubleshooting
          rules: {
            '@typescript-eslint/adjacent-overload-signatures': 'off',
            '@typescript-eslint/sort-type-constituents': 'off',
          },
        },
        /*
          <-------------JS, JSX, TS, TSX, COMMON RULES------------->
        */
        {
          files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
          rules: {
            'no-plusplus': 'off',
            'no-return-await': 'off',
            camelcase: ['error', { properties: 'always', allow: camelCaseAllow }],
            'class-methods-use-this': 'off',
            'no-await-in-loop': 'off',
            'no-alert': isDevelopment ? 'off' : 'error',
            'no-console': isDevelopment ? 'off' : 'error',
            'no-debugger': isDevelopment ? 'off' : 'error',
            'no-param-reassign': 'off',
            'no-underscore-dangle': 'off',
            'newline-before-return': 'error',
            'no-warning-comments': 'warn',

            'prettier/prettier': ['error', prettierConfig],

            'import/no-extraneous-dependencies': 'error',
            'import/prefer-default-export': 'off',
            'import/no-default-export': 'error',
            'import/no-unresolved': ['error', { caseSensitiveStrict: true }],

            'unicorn/custom-error-definition': 'error',
            'unicorn/empty-brace-spaces': 'error',
            'unicorn/error-message': 'error',
            'unicorn/filename-case': [
              'error',
              {
                case: 'kebabCase',
              },
            ],
            'unicorn/no-instanceof-array': 'error',
            'unicorn/prefer-keyboard-event-key': 'error',
            'unicorn/prefer-node-protocol': 'error',
            'unicorn/throw-new-error': 'error',

            'check-file/folder-naming-convention': [
              'error',
              {
                'src/**/': 'KEBAB_CASE'
              }
            ]
          },
        },
        /*
          <-------------TS, TSX, COMMON RULES------------->
        */
        {
          files: ['*.ts', '*.tsx'],
          rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/ban-types': 'off',
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
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/return-await': 'off',
            '@typescript-eslint/no-empty-interface': [
              'error',
              {
                allowSingleExtends: true,
              },
            ],
            '@typescript-eslint/naming-convention': [
              'error',
              {
                filter: {
                  match: false,
                  regex: ignoredPropNames,
                },
                format: ['UPPER_CASE', 'StrictPascalCase'],
                prefix: ['I'],
                selector: 'interface',
              },
            ],
            '@typescript-eslint/ban-ts-comment': isDevelopment ? 'off' : 'error',
          }
        },
        /*
          <-------------REACT RULES------------->
        */
        {
          files: ['*.tsx', '*.jsx'],
          rules: reactRules,
        },
        {
          files: ['*.tsx'],
          rules: {
            'react/prop-types': 'off'
          }
        },
        /*
          <-------------JSON RULES------------->
        */
        {
          files: ['**/**/*.json'],
          extends: ['plugin:json/recommended'],
          rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
            'prettier/prettier': 'off',
          },
        },
        /*
          <-------------CONFIG RULES------------->
        */
        {
          files: ['jest.config.ts', 'jest.e2e.config.ts'],
          rules: {
            'import/no-default-export': 'off',
            'import/no-extraneous-dependencies': 'off',
          },
        },
        /*
          <-------------GLOBAL TYPES RULES------------->
        */
        {
          files: ['**/global.declaration.ts'],
          rules: {
            'import/no-default-export': 'off',
          },
        },
        /*
          <-------------LOADABLE COMPONENTS RULES------------->
        */
        {
          files: ['**/*.loadable.ts', '**/*.loadable.tsx', '**/*.loadable.js', '**/*.loadable.jsx'],
          rules: {
            'import/no-default-export': 'off',
          },
        },
        /*
          <-------------STORYBOOK COMPONENTS RULES------------->
        */
        {
          files: ['**/*.stories.jsx', '**/*.stories.tsx'],
          rules: {
            'import/no-default-export': 'off',
            'import/no-extraneous-dependencies': 'off',
          },
        },
        /*
          <-------------SPEC RULES------------->
        */
        {
          files: [
            '**/*.spec.jsx',
            '**/*.spec.tsx',
            '**/*.spec.js',
            '**/*.spec.ts',
            '**/*.e2e-spec.jsx',
            '**/*.e2e-spec.tsx',
            '**/*.e2e-spec.js',
            '**/*.e2e-spec.ts'
          ],
          rules: {
            'jest-formatting/padding-around-all': 'error',
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ],
    },
    customConfig,
  );
};
