const deepExtend = require('deep-extend');

module.exports = {
  makeConfig: (overrideRules = {}, customConfig = {}, opts = {}) => {
    if (!overrideRules) {
      overrideRules = {};
    }
    if (!customConfig) {
      customConfig = {};
    }

    const tsconfigPath = opts && typeof opts.tsconf === 'string' ?
      opts.tsconf :
      './tsconfig.json';

    const isNodejs = !!opts.nodejs;

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
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-duplicate-string': 'off',
      quotes: ['error', 'single'],
    };

    const extendsRules = [
      'plugin:sonarjs/recommended',
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:promise/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'airbnb'
    ];

    if (isNodejs) {
      extendsRules.push('plugin:node/recommended');
    }

    const plugins = [
      'babel',
      'jest',
      'react',
      'promise',
      'react-hooks'
    ];

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
            project: tsconfigPath
          },
          extends: [
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/eslint-recommended',
            'airbnb-typescript'
          ],
          plugins: [
            '@typescript-eslint'
          ],
          rules: deepExtend({}, commonRules, {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'react/prop-types': 'off',
            quotes: 'off',
            'no-unused-vars': 'off',
            semi: 'off'
          }, overrideRules)
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
      rules: deepExtend({}, commonRules, overrideRules)
    }, customConfig);
  }
};
