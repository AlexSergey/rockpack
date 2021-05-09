const path = require('path');
const { existsSync } = require('fs');
const deepExtend = require('deep-extend');

function getMajorVersion(version) {
  return typeof version === 'string' && version.includes('.') ?
    version.split('.')[0] :
    false;
}

const _makeConfig = (commonRules = {}, tsCommonRules = {}, overrideRules = {}, customConfig = {}, opts = {}) => {
  const { root, packageJson, hasReact } = opts;
  let tsConfig = false;

  if (existsSync(path.resolve(root, './tsconfig.js'))) {
    tsConfig = path.resolve(root, './tsconfig.js');

    if (
      opts.debug &&
      existsSync(path.resolve(root, './tsconfig.debug.js'))
    ) {
      tsConfig = path.resolve(root, './tsconfig.debug.js');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.json'))) {
    tsConfig = path.resolve(root, './tsconfig.json');

    if (
      opts.debug &&
      existsSync(path.resolve(root, './tsconfig.debug.json'))
    ) {
      tsConfig = path.resolve(root, './tsconfig.debug.json');
    }
  }

  if (existsSync(path.resolve(root, './tsconfig.development.js')) && process.env.NODE_ENV === 'development') {
    tsConfig = path.resolve(root, './tsconfig.development.js');
  }
  if (existsSync(path.resolve(root, './tsconfig.production.js')) && process.env.NODE_ENV === 'production') {
    tsConfig = path.resolve(root, './tsconfig.production.js');
  }

  let reactNewSyntax = false;

  if (hasReact) {
    reactNewSyntax = getMajorVersion(packageJson.dependencies.react) >= 17;
  }

  if (reactNewSyntax) {
    commonRules['react/jsx-uses-react'] = 'off';
    commonRules['react/react-in-jsx-scope'] = 'off';
  }

  if (!overrideRules) {
    overrideRules = {};
  }
  if (!customConfig) {
    customConfig = {};
  }

  const isNodejs = !!opts.nodejs;

  const extendsRules = [
    'plugin:sonarjs/recommended',
    'eslint:recommended',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    hasReact ? 'airbnb' : 'airbnb/base'
  ];

  if (isNodejs) {
    extendsRules.push('plugin:node/recommended');
  }

  const plugins = [
    'babel',
    'jest',
    'promise'
  ];

  if (hasReact) {
    extendsRules.push('plugin:react/recommended');
    plugins.push('react');
    plugins.push('react-hooks');
  }

  return deepExtend({}, {
    extends: extendsRules,
    parser: require.resolve('babel-eslint'),
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        modules: true,
        jsx: true,
        useJSXTextNode: true
      }
    },
    env: {
      browser: true,
      'jest/globals': true,
      es6: true
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parser: require.resolve('@typescript-eslint/parser'),
        parserOptions: {
          project: tsConfig || './tsconfig.json'
        },
        extends: [
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/eslint-recommended',
          hasReact ? 'airbnb-typescript' : 'airbnb-typescript/base'
        ],
        plugins: [
          '@typescript-eslint'
        ],
        rules: deepExtend({}, commonRules, tsCommonRules, overrideRules)
      }
    ],
    plugins,
    globals: {
      global: true,
      globalThis: true,
      shallow: true,
      render: true,
      mount: true,
      mountToJson: true,
      shallowToJson: true,
      renderToJson: true,
      createSerializer: true
    },
    rules: deepExtend({}, commonRules, overrideRules),
  }, customConfig);
};

module.exports = {
  cleanConfig: (overrideRules = {}, customConfig = {}, opts = {}) => {
    const root = process.cwd();
    const packageJsonPath = path.resolve(root, 'package.json');
    // eslint-disable-next-line global-require
    const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};

    let hasReact = false;

    if (packageJson &&
      packageJson.dependencies &&
      packageJson.dependencies.react
    ) {
      hasReact = true;
    }

    _makeConfig({}, {}, overrideRules, customConfig, { ...opts,
      ...{
        root,
        packageJson,
        hasReact
      }
    });
  },

  rockConfig: (overrideRules = {}, customConfig = {}, opts = {}) => {
    const root = process.cwd();
    const packageJsonPath = path.resolve(root, 'package.json');
    // eslint-disable-next-line global-require
    const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};

    let hasReact = false;

    if (packageJson &&
      packageJson.dependencies &&
      packageJson.dependencies.react
    ) {
      hasReact = true;
    }

    const commonRules = {
      indent: ['error', 2, {
        SwitchCase: 1
      }],
      'no-trailing-spaces': 'off',
      'object-curly-newline': 'off',
      'no-return-await': 'off',
      'no-await-in-loop': 'off',
      'no-continue': 'off',
      'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-loop-func': 'off',
      'spaced-comment': 'off',
      'default-case': 'off',
      'no-implicit-coercion': 'error',
      'arrow-parens': 'off',
      'class-methods-use-this': 'off',
      'comma-dangle': 'off',
      'consistent-return': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'prefer-spread': 'off',
      'prefer-destructuring': 'off',
      'prefer-object-spread': 'off',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'import/no-dynamic-require': 'off',
      'import/prefer-default-export': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/heading-has-content': 'off',
      'jsx-quotes': ['error', 'prefer-double'],
      'max-len': ['warn', 120, {
        ignoreComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
      }],
      'newline-per-chained-call': 'error',
      'no-else-return': ['error', {
        allowElseIf: true
      }],
      'no-shadow': 'warn',
      'no-undef': ['error', {
        typeof: true
      }],
      'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'babel/no-unused-expressions': 'error',
      'no-unused-expressions': 'off',
      'no-use-before-define': ['error', {
        functions: false,
        classes: true
      }],
      'operator-linebreak': ['error', 'after'],
      'promise/no-nesting': 'off',
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'warn',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-duplicate-string': 'off',
      quotes: ['error', 'single'],
    };

    const tsCommonRules = {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true
      }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@typescript-eslint/ban-ts-comment': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@typescript-eslint/comma-dangle': 'off',
      quotes: 'off',
      'no-unused-vars': 'off',
      semi: 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error']
    };

    if (hasReact) {
      Object.assign(commonRules, {
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react/destructuring-assignment': 'off',
        'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
        'react/jsx-filename-extension': ['error', {
          extensions: ['.jsx', '.tsx']
        }],
        'react/jsx-indent': ['error', 2, {
          indentLogicalExpressions: true
        }],
        'react/jsx-indent-props': ['error', 2],
        'react/jsx-one-expression-per-line': 'off',
        'react/jsx-props-no-multi-spaces': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/no-array-index-key': 'warn',
        'react/no-danger': 'off',
        'react/prop-types': 'error',
        'react/no-unescaped-entities': 'off',
        'react/static-property-placement': 'off',
        'react/prefer-stateless-function': 'off',
        'react/require-default-props': 'off',
      });

      Object.assign(tsCommonRules, {
        'react/prop-types': 'off',
      });
    }

    return _makeConfig(commonRules, tsCommonRules, overrideRules, customConfig, {
      ...opts,
      ...{
        root,
        packageJson,
        hasReact
      }
    });
  }
};
