<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/codestyle

**@rockpack/codestyle** is an opinionated ESLint configuration with best-practice rules, Prettier, Stylelint, and Commitlint - ready to use out of the box.

**@rockpack/codestyle** fully supports ESLint 10 flat config.

**@rockpack/codestyle** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Features:

### ESLint configs:

- TypeScript, JavaScript, and React support
- Prettier integrated
- ESLint Config Recommended
- ESLint React Recommended
- ESLint TypeScript Recommended
- ESLint Prettier Recommended
- eslint-plugin-perfectionist
- eslint-plugin-regexp
- eslint-plugin-sonarjs
- eslint-plugin-unicorn
- eslint-plugin-import-lite
- eslint-plugin-no-only-tests
- eslint-plugin-check-file
- eslint-plugin-package-json

### Additional tools:

- Stylelint
- Commitlint
- Prettier

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/codestyle --save-dev

# YARN
yarn add @rockpack/codestyle --dev
```

2. Create **eslint.config.js** and **.prettierrc** in the root of the project.

3. Put the code in **eslint.config.js**:

```js
const { makeConfig } = require('@rockpack/codestyle');

module.exports = makeConfig();
```

4. Put the code in **.prettierrc**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "useTabs": false,
  "semi": true,
  "bracketSpacing": true,
  "printWidth": 120,
  "endOfLine": "lf"
}
```

## Extensibility

If you need to change the ESLint configuration you can just extend return object from **makeConfig** function:

```ts
const { makeConfig } = require('@rockpack/codestyle');

const camelCaseAllow = ['download_url'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
  },
});

module.exports = config;
```

## IDE Integration

We can set up our IDE to fix all lint rules and format code by Prettier.

### Webstorm

#### Manual setup

1. Open Settings
2. Find the Node.js section and select the Node.js interpreter.
3. Find ESLint.

- Set Manual Configuration and set folder to "node_modules/eslint" in your project
- Set working directories to root of your project
- Set path to your *.eslintrc.js* file
- Select "Run eslint --fix on save"

4. Find Prettier.

- Set Prettier path
- Select "On Reformat code action", "On save"

### VSCode

#### Manual setup

1. Set "Format on save"
2. Set "Format on paste"

#### Configuration setup

```shell
mkdir .vscode && touch .vscode/settings.json
```

Then add settings:

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
