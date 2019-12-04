const fs = require('fs');
const extend = require('deep-extend');

let custom = {};

if (fs.existsSync('./.eslintrc.custom.js')) {
    custom = require('./.eslintrc.custom.js');
}

module.exports = extend(
    {},
    {
        extends: [
            'eslint:recommended',
            'plugin:react/recommended',
            'plugin:promise/recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
            'prettier/flowtype',
            'prettier/@typescript-eslint',
            'prettier/react',
            'prettier/standard',
            'airbnb',
            'prettier',
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            ecmaFeatures: {
                modules: true,
                jsx: true,
                useJSXTextNode: true,
            },
        },
        env: {
            browser: true,
            'jest/globals': true,
        },
        plugins: ['babel', 'jest', 'react', 'promise', '@typescript-eslint', 'prettier'],
        rules: {
            'prettier/prettier': 'error',
            'react/jsx-filename-extension': [
                1,
                {
                    extensions: ['.js', '.jsx', '.tsx'],
                },
            ],
            'react/prop-types': 0,
            'react/require-default-props': ['off'],
            'react/no-unused-prop-types': [
                1,
                {
                    skipShapeProps: true,
                },
            ],
            'react/prefer-stateless-function': 0,
            'react/destructuring-assignment': 0,
            'react/jsx-one-expression-per-line': 0,
            'react/jsx-props-no-multi-spaces': 0,
            'prefer-destructuring': 0,
            'promise/no-nesting': 0,
            // basic overrides
            'comma-dangle': 0,
            'no-use-before-define': 0,
            'no-underscore-dangle': 0,
            'class-methods-use-this': 0,
            'import/no-unresolved': 0,
            'no-shadow': 0,
            'no-unused-vars': 0,
            '@typescript-eslint/array-type': 1,
            '@typescript-eslint/explicit-function-return-type': [
                1,
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/explicit-member-accessibility': [1, { accessibility: 'no-public' }],
            '@typescript-eslint/member-delimiter-style': 1,
            '@typescript-eslint/no-non-null-assertion': 1,
            '@typescript-eslint/no-use-before-define': 1,
            '@typescript-eslint/no-var-requires': 1,
            '@typescript-eslint/type-annotation-spacing': 1,
            'react-hooks/rules-of-hooks': 2,
            'react-hooks/exhaustive-deps': 1
        },
    },
    custom
);
