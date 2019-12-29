const fs = require('fs');

const isTypescript = fs.readdirSync(__dirname).filter(fn => {
    return fn.match(/tsconfig?(.)*(.js|.json)/ig);
}).length > 0;

const parser = isTypescript ? '@typescript-eslint/parser' : 'babel-eslint';

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parser,
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
    plugins: [
        'babel',
        'jest',
        'react',
        'react-hooks'
    ],
    rules: {
        'indent': ['error', 4],
        'max-len': ['warn', 120, { ignoreComments: true }],
        'react/jsx-filename-extension': [
            'error', {
                extensions: ['.jsx', '.tsx'],
            },
        ],
        'react/jsx-indent': ['error', 4, { indentLogicalExpressions: true }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },
};
