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

`@types/jest` is a regular dependency of `@rockpack/tester` on purpose: specs use the Jest globals (`describe`, `it`, `expect`, `jest`), so their types come with the tester and need no separate install.

2. Create **scripts.tests.ts** in the root of the project:

```ts
import { tester } from '@rockpack/tester';

void tester();
```

`tester()` resolves to Jest's aggregated results (or `undefined` when Jest could not run) and never exits the process itself: a failure sets `process.exitCode = 1`. Await it to act on the results:

```ts
const results = await tester();
console.log(results?.numPassedTests);
```

3. Run tests:

```shell
npx tsx scripts.tests.ts
```

or in watch mode (`--watch` is read from the command line unless `watch` is passed explicitly):

```shell
npx tsx scripts.tests.ts --watch
```

4. Create `something.spec.js` (or `.spec.ts`) in the `src` folder and write your Jest tests.

**See the `examples` folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/examples" target="_blank">here</a>

## Options

`tester(options, jestConfig)`:

| Option | Default | Description |
|---|---|---|
| `src` | `'./src'` | Folder (or folders) with the specs |
| `prefix` | `'(spec\|test)'` | Spec file suffix: `*.spec.ts`, `*.test.ts` |
| `watch` | `--watch` on the command line | Jest watch mode |
| `serial` | `false` | Run the suites one by one without cache, for tests that share ports or files |
| `coverage` | `true` | `false` turns coverage off; `{ collectCoverageFrom, reporters, thresholds }` adjusts it (values in the Jest config still win) |

Outside watch mode coverage is collected from every file under `src` (not only the imported ones) and reported as `json`, `html`, `text-summary` and `lcov`. Everything can be overridden through the Jest config, for example thresholds:

```ts
void tester({}, { coverageThreshold: { global: { branches: 80, functions: 85, lines: 85, statements: 85 } } });
```

Sources that use NodeNext-style `.js` extensions in relative imports work out of the box: `import { sum } from './sum.js'` resolves to `sum.ts`.

## Configuration

To override Jest configuration - for example, to switch the test environment from jsdom to Node:

```ts
import { tester } from '@rockpack/tester';

void tester({}, { testEnvironment: 'node' });
```

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
