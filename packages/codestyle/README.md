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
- typescript-eslint `strictTypeChecked` and `stylisticTypeChecked`
- @eslint-react `recommended-typescript` and eslint-plugin-react-hooks `recommended` (React Compiler rules included)
- eslint-plugin-prettier `recommended`
- @eslint/json for JSON files
- eslint-plugin-perfectionist
- eslint-plugin-regexp
- eslint-plugin-sonarjs
- eslint-plugin-unicorn
- eslint-plugin-import-lite
- eslint-plugin-no-only-tests
- eslint-plugin-check-file
- eslint-plugin-package-json
- eslint-plugin-jest - specs and fixtures
- eslint-plugin-testing-library and eslint-plugin-jest-dom - test files of React projects
- eslint-config-flat-gitignore - file-based ignore patterns via `.eslintflatignore`

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

Node.js 24.15 or newer and ESLint 10 are required.

2. Create **eslint.config.ts** and **.prettierrc** in the root of the project.

3. Put the code in **eslint.config.ts**:

```ts
import { makeConfig } from '@rockpack/codestyle';

export default makeConfig();
```

The package is ESM only. A CommonJS `eslint.config.cjs` works through `require()` of ES modules: `module.exports = require('@rockpack/codestyle').makeConfig();`.

4. Create **.eslintflatignore** in the root of the project to define ignored paths:

```
node_modules
dist/
build/
lib/
coverage/
*.log
```

`makeConfig` searches for `.eslintflatignore` starting from the current working directory and walks up the directory tree. This means it works in both single repos and monorepos - place the file at the monorepo root and all packages will pick it up automatically.

> **Note:** `.d.ts` files are linted but the rules `@import-lite/no-default-export`, `@typescript-eslint/naming-convention` and `@typescript-eslint/no-extraneous-class` are disabled for them.

TypeScript files use the typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` presets plus `prefer-readonly` and `switch-exhaustiveness-check`. A few preset rules are tuned: numbers are allowed in template literals, void arrow shorthands are allowed, `||` stays allowed for strings (an empty string often means "not set"), and `no-dynamic-delete` and `non-nullable-type-assertion-style` are off.

## What the rules enforce

Besides the presets, these rules report errors:

- **Types:** `type` aliases instead of `interface` (`consistent-type-definitions`), `import type` for type-only imports, explicit return types on functions TypeScript cannot type from context (React components included), no `@ts-` comments without a description, `??` instead of `||` except for strings.
- **Bugs:** `eqeqeq` (`== null` stays allowed), `@typescript-eslint/no-shadow`, the sonarjs detectors (identical conditions, branches and functions, ignored return values, empty or unused collections, gratuitous expressions and more), cognitive complexity above 20, and the unicorn detectors (`throw new Error`, `TypeError` for type checks, `node:` imports, useless spreads, promise misuse and more).
- **Style:** `camelcase` (properties too), the `@typescript-eslint/naming-convention` rules, `newline-before-return`, `no-console`, `no-alert`, `no-debugger`, no default exports, kebab-case file and folder names under `src`, sorted imports and keys (perfectionist), Prettier formatting.
- **Tests** (`*.{spec,test}.{js,jsx,ts,tsx}` and `__fixtures__`): the Jest globals and the eslint-plugin-jest rules that catch mistakes (focused, disabled or conditional tests, `done` callbacks, invalid `expect` and titles, snapshot interpolation), `no-only-tests`.
- **React projects:** the @eslint-react rules, the rules of hooks and the React Compiler rules of eslint-plugin-react-hooks, and in test files eslint-plugin-testing-library (`flat/react`) and eslint-plugin-jest-dom.

5. Put the code in **.prettierrc**

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

## Options

`makeConfig` detects the project setup on its own. Pass options to override the detection:

```js
module.exports = makeConfig({
  ignoreFile: '.gitignore', // ignore file relative to the working directory; false turns ignore files off
  jest: false, // leave out the Jest, Testing Library and jest-dom rules for test files (on by default)
  react: true, // React rules; detected from `react` in package.json dependencies by default
  tsconfig: 'tsconfig.lint.json', // tsconfig for type-aware linting; tsconfig.eslint.json, then tsconfig.json by default
});
```

## Extensibility

If you need to change the ESLint configuration you can just extend return object from **makeConfig** function:

```ts
import { makeConfig } from '@rockpack/codestyle';

const camelCaseAllow = ['download_url'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
  },
});

export default config;
```

## Stylelint and Commitlint

The package ships shared configs for Stylelint (SCSS, Tailwind CSS v4, Prettier and a clean property order) and Commitlint (Conventional Commits limited to `ci`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`). They reference their presets by absolute path, so the presets are resolved from `@rockpack/codestyle` and need no separate installation.

**.stylelintrc.cjs**:

```js
const { stylelintConfig } = require('@rockpack/codestyle/stylelint');

module.exports = stylelintConfig;
```

**.commitlintrc.cjs**:

```js
const { commitlintConfig } = require('@rockpack/codestyle/commitlint');

module.exports = commitlintConfig;
```

To change a rule, spread the config: `module.exports = { ...stylelintConfig, rules: { ...stylelintConfig.rules, 'color-named': null } };`.

## IDE Integration

We can set up our IDE to fix all lint rules and format code by Prettier.

### Webstorm

#### Manual setup

1. Open Settings
2. Find the Node.js section and select the Node.js interpreter.
3. Find ESLint.

- Set Manual Configuration and set folder to "node_modules/eslint" in your project
- Set working directories to root of your project
- Set the configuration file to *eslint.config.ts* (or leave it to automatic search)
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

## How the config is composed

`makeConfig()` returns a flat config array assembled from the rule groups in `src/rules`: the ignore file, the typescript-eslint presets for TypeScript files, style (Prettier, perfectionist, regexp), the Rockpack TypeScript rules with type-aware linting through the detected `tsconfig`, the JSON, `package.json` and plain JavaScript blocks, React (when `react` is a dependency: the @eslint-react and react-hooks blocks), file-type overrides (`.d.ts`, config files), the Jest blocks for test files and fixtures and, for React projects, Testing Library and jest-dom, all for `*.{spec,test}.{js,jsx,ts,tsx}`. Later blocks override earlier ones, so a block you push at the end wins.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
