<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/tester

**@rockpack/tester** is a pre-configured Jest setup with TypeScript and Babel support, HTML reporting, and best-practice defaults for React projects.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Included

- Full TypeScript and Babel support via `@rockpack/babel`
- [jest-html-reporters](https://github.com/Hazyzh/jest-html-reporters) - HTML test report generation
- jsdom environment for React component testing
- CSS module mocking via identity-object-proxy

## Using

1. Installation:

```sh
# NPM
npm install @rockpack/tester --save-dev

# YARN
yarn add @rockpack/tester --dev
```

2. Create **tests.js** in the root of the project:

```js
const tests = require('@rockpack/tester');

tests();
```

3. Run tests:

```shell
node tests.js
```

or in watch mode:

```shell
node tests.js --watch
```

4. Create `something.spec.js` (or `.spec.ts`) in the `src` folder and write your Jest tests.

**See the `examples` folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/examples" target="_blank">here</a>

## Configuration

To override Jest configuration - for example, to switch the test environment from jsdom to Node:

```ts
const { tester } = require('@rockpack/tester');

tester(
  {},
  {
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    modulePathIgnorePatterns: ['./src/generators/'],
    testEnvironment: 'node',
  },
);
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
