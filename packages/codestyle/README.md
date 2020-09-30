# @rockpack/codestyle

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md">Readme (Russian version)</a>
</p>

**@rockpack/codestyle** is an efficiently customized Eslint with many best practice rules and additions.

**@rockpack/codestyle** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Features:

- TS support, React support
- eslint-config-airbnb
- eslint-config-airbnb-typescript
- eslint-plugin-import
- eslint-plugin-node
- eslint-plugin-promise
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-sonarjs
- eslint-plugin-jsx-a11y

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/codestyle --save-dev

# YARN
yarn add @rockpack/codestyle --dev
```

2. Make **.eslintrc.js** in the root of project

3. Put the code in **.eslintrc.js**

```js
const { rockConfig, cleanConfig } = require('@rockpack/codestyle');

module.exports = rockConfig();
```

*The difference between rockConfig and cleanConfig is that cleanConfig does not use any third-party overrides, from the author of Rockpack*

To override properties, you need to pass the object to *rockConfig* or *cleanConfig*

*It completely supports IDE editors*

```js
const { rockConfig } = require('@rockpack/codestyle');

module.exports = rockConfig({
  'no-plusplus': 'error'
});
```

Second parameter *rockConfig* or *cleanConfig* helps override all config

```js
const { rockConfig } = require('@rockpack/codestyle');

module.exports = rockConfig({}, {
  plugins: [
    'some new plugin'
  ]
});
```

### rockConfig rules overriding:

```js
// JS:
({
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
});

// TS
({
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
  'react/prop-types': 'off',
  quotes: 'off',
  'no-unused-vars': 'off',
  semi: 'off'
})
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
