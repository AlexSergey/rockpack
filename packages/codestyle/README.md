<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/codestyle

**@rockpack/codestyle** is an efficiently customized Eslint with many best practice rules and additions.

**@rockpack/codestyle** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Features:

### Eslint configs:

- TS support, pure JS support, React support
- Prettier integrated
- Eslint Config Recommended
- Eslint React Recommended
- Eslint Airbnb Base Config
- Eslint Import Recommended
- Eslint TS Recommended
- Eslint Prettier Recommended

### Additional tools:

- Stylelint
- Commitlint

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/codestyle --save-dev

# YARN
yarn add @rockpack/codestyle --dev
```

2. Make **.eslintrc.js**, **.prettierrc** in the root of project

3. Put the code in **.eslintrc.js**

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

## IDE Integration

We can set up our IDE to fix all lint rules and format code by Prettier.

### Webstorm

#### Manual setup

1. Open Preferences
2. Find Node.js tab. Choice Node.js interpreter
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
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "javascriptreact",
      "autoFix": true
    },
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
  "tslint.enable": false
}
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
