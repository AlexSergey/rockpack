const fs = require('fs');
const deepExtend = require('deep-extend');

const isTypescript = fs.readdirSync(__dirname).filter(fn => {
    return fn.match(/tsconfig?(.)*(.js|.json)/ig);
}).length > 0;

const parser = isTypescript ? '@typescript-eslint/parser' : 'babel-eslint';

const commonRules = {
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'consistent-return': 'off',
    indent: ['error', 4],
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
    'prefer-object-spread': 'off'
};

module.exports = {
    makeConfig: (customConfig = {}) => {
        return (() => {
            const extendsRules = [
                'eslint:recommended',
                'plugin:react/recommended',
                'plugin:promise/recommended',
                'plugin:import/errors',
                'plugin:import/warnings',
                'airbnb'
            ];

            if (isTypescript) {
                extendsRules.push('plugin:@typescript-eslint/recommended');
                extendsRules.push('airbnb-typescript');
            }

            const plugins = [
                'babel',
                'jest',
                'react',
                'promise',
                '@typescript-eslint',
                'react-hooks'
            ];

            if (isTypescript) {
                plugins.push('@typescript-eslint');
            }

            const rules = {
                'import/no-extraneous-dependencies': 'off',
                'import/no-unresolved': 'off',
                'jsx-a11y/click-events-have-key-events': 'off',
                'jsx-a11y/no-static-element-interactions': 'off',
                'jsx-quotes': ['error', 'prefer-single'],
                'max-len': ['warn', 120, {
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                    ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
                }],
                'newline-per-chained-call': 'error',
                'no-console': 'error',
                'no-else-return': ['error', {
                    allowElseIf: true
                }],
                'no-shadow': 'warn',
                'no-undef': ['error', {
                    typeof: true
                }],
                'no-unused-vars': 'error',
                'no-use-before-define': ['error', {
                    functions: true,
                    classes: true
                }],
                'operator-linebreak': ['error', 'after'],
                'promise/no-nesting': 'off',
                'react-hooks/exhaustive-deps': 'warn',
                'react-hooks/rules-of-hooks': 'error',
                'react/destructuring-assignment': 'off',
                'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
                'react/jsx-filename-extension': ['error', {
                    extensions: [ '.jsx', '.tsx' ]
                }],
                'react/jsx-indent': [ 'error', 4, {
                    indentLogicalExpressions: true
                }],
                'react/jsx-one-expression-per-line': 'off',
                'react/jsx-props-no-multi-spaces': 'off',
                'react/no-array-index-key': 'warn',
                'react/no-danger': 'off',
                'react/no-unescaped-entities': 'off',
                'react/prefer-stateless-function': 'off',
                'react/require-default-props': 'off',
                quotes: ['error', 'single'],
            };

            return deepExtend({}, {
                extends: extendsRules,
                parser,
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
                plugins,
                globals: {
                    global: true
                },
                rules: deepExtend({}, commonRules, rules)
            }, customConfig);
        })();
    }
};
