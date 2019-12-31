const fs = require('fs');
const deepExtend = require('deep-extend');

const isTypescript = fs.readdirSync(__dirname).filter(fn => {
    return fn.match(/tsconfig?(.)*(.js|.json)/ig);
}).length > 0;

const parser = isTypescript ? '@typescript-eslint/parser' : 'babel-eslint';

module.exports = {
    development: (customConfig = {}) => {
        return deepExtend({}, {
            extends: [
                'eslint:recommended'
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
                es6: true
            },
            plugins: [
                'babel',
                'jest',
                'react',
                'react-hooks'
            ],
            globals: {
                'global': true
            },
            rules: {
                indent: ['error', 4],
                quotes: ['error', 'single'],
                'jsx-quotes': ['error', 'prefer-single'],
                'no-undef': ['error', {
                    typeof: true
                }],
                'max-len': ['warn', 120, {
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                    ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
                }],
                'react/jsx-filename-extension': ['error', {
                    extensions: [ '.jsx', '.tsx' ]
                }],
                'react/jsx-indent': [ 'error', 4, {
                    indentLogicalExpressions: true
                }],
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn'
            }
        }, customConfig);
    },
    production: (customConfig = {}) => {
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
            }

            const parser = isTypescript ? '@typescript-eslint/parser' : 'babel-eslint';

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
                indent: ['error', 4],
                quotes: ['error', 'single'],
                'jsx-quotes': ['error', 'prefer-single'],
                'newline-per-chained-call': 'error',
                'no-undef': ['error', {
                    typeof: true
                }],
                'max-len': ['warn', 120, {
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                    ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
                }],
                'operator-linebreak': ['error', 'after'],
                'no-nested-ternary': 'off',
                'prefer-object-spread': 'off',
                'consistent-return': 'off',
                'arrow-parens': 'off',
                'react/jsx-filename-extension': ['error', {
                    extensions: [ '.jsx', '.tsx' ]
                }],
                'no-else-return': ['error', {
                    allowElseIf: true
                }],
                'no-console': 'error',
                'react/no-danger': 'warn',
                'react/prefer-stateless-function': 'warn',
                'react/destructuring-assignment': 'warn',
                'react/jsx-indent': ['error', 4, {
                    indentLogicalExpressions: true
                }],
                'jsx-a11y/no-static-element-interactions': 'off',
                'jsx-a11y/click-events-have-key-events': 'off',
                'prefer-destructuring': 'off',
                'comma-dangle': 'off',
                'no-underscore-dangle': 'off',
                'class-methods-use-this': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/no-unresolved': 'off',
                'no-shadow': 'warn',
                'no-unused-vars': 'error',
                'no-plusplus': 'off',
                'no-param-reassign': 'off',
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn'
            };

            if (isTypescript) {
                Object.assign(rules, {
                    '@typescript-eslint/array-type': 'warn',
                    '@typescript-eslint/explicit-function-return-type': [
                        'warn',
                        {
                            allowExpressions: true,
                            allowTypedFunctionExpressions: true
                        }
                    ],
                    '@typescript-eslint/explicit-member-accessibility': [
                        'warn',
                        {
                            accessibility: 'no-public'
                        }
                    ],
                    '@typescript-eslint/member-delimiter-style': 'warn',
                    '@typescript-eslint/no-non-null-assertion': 'warn',
                    '@typescript-eslint/no-use-before-define': 'warn',
                    '@typescript-eslint/no-var-requires': 'off',
                    '@typescript-eslint/type-annotation-spacing': 'warn'
                })
            }

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
                rules
            }, customConfig);
        })();
    }
};
