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
            'react/jsx-props-no-multi-spaces': 0, // this rule doesn't comprehend generics in JSX
            'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
            'prefer-destructuring': 0,
            'promise/no-nesting': 0,
            // basic overrides
            'comma-dangle': 0, // prettier takes care of this and can't be made to cooperate here..
            'no-use-before-define': 0,
            'no-underscore-dangle': 0,
            'class-methods-use-this': 0,
            'import/no-unresolved': 0,
            'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: ['**/*.test.{ts,tsx}', '**/test-utils/**/*.{ts,tsx}'] },
            ],
            'no-shadow': 'off',
            'no-unused-vars': 'off',
            'max-len': [2, { code: 120, ignorePattern: '^import\\W.*' }],
            // typescript-eslint overrides
            '@typescript-eslint/array-type': 1,
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/explicit-member-accessibility': [1, { accessibility: 'no-public' }],
            '@typescript-eslint/member-delimiter-style': 1,
            '@typescript-eslint/no-non-null-assertion': 1, // TODO: change this back to an error ASAP
            '@typescript-eslint/no-use-before-define': 1,
            '@typescript-eslint/no-var-requires': 1,
            '@typescript-eslint/type-annotation-spacing': 1,
        },
    },
    custom
);
