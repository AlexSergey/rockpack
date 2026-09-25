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

2. Create **scripts.tests.mts** in the root of the project (Node.js 24 runs TypeScript itself; `.mts` makes it an ES module):

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
node scripts.tests.mts
```

or in watch mode (`--watch` is read from the command line unless `watch` is passed explicitly):

```shell
node scripts.tests.mts --watch
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
| `esm` | `false` | Run the specs as ES modules (see below) |
| `replaceArrays` | `false` | By default `setupFiles`, `setupFilesAfterEnv`, `moduleFileExtensions` and `testPathIgnorePatterns` from the Jest config extend the tester's defaults; `true` makes them replace the defaults |

Outside watch mode coverage is collected from every file under `src` (not only the imported ones) and reported as `json`, `html`, `text-summary` and `lcov`. Everything can be overridden through the Jest config, for example thresholds:

```ts
void tester({}, { coverageThreshold: { global: { branches: 80, functions: 85, lines: 85, statements: 85 } } });
```

Sources that use NodeNext-style `.js` extensions in relative imports work out of the box: `import { sum } from './sum.js'` resolves to `sum.ts`.

### ES module specs

By default the specs are compiled to CommonJS. With `esm: true` they run as real ES modules: `import.meta`, top-level await and ES-only packages work without mocks. Jest supports this only when Node.js runs with `--experimental-vm-modules`, so the test script changes too (the tester explains it and exits with code `1` otherwise):

```ts
// scripts.tests.mts
void tester({ esm: true });
```

```json
"test": "node --experimental-vm-modules scripts.tests.mts"
```

In ES module specs the `jest` object is not a global: import it with `import { jest } from '@jest/globals'`. See `examples/tester/esm`.

With `--experimental-vm-modules` Jest can also `require()` ES-only packages from CommonJS specs (Node.js 24.9 or newer), and it always loads `.mjs` files as ES modules; the tester keeps their `import`/`export` in that case, so `.mjs` sources work in both modes.

## Configuration

To override Jest configuration - for example, to switch the test environment from jsdom to Node:

```ts
import { tester } from '@rockpack/tester';

void tester({}, { testEnvironment: 'node' });
```

## How the Jest config is built

`tester(options, jestConfig)` builds the Jest config in `src/configs/config-compiler.ts` and runs it with Jest's `runCLI`:

1. `jest.init.*`, `jest.setup.*`, `jest.global.setup.*` and `jest.global.teardown.*` in the project root become `setupFiles`, `setupFilesAfterEnv`, `globalSetup` and `globalTeardown`.
2. The defaults are added: the `jsdom` environment, Babel transforms from `@rockpack/babel` in test mode (one preset for JavaScript, one for TypeScript), stubs for styles and static files, and the `TextEncoder` polyfill.
3. Your Jest config is merged in. Arrays such as `setupFilesAfterEnv` extend the defaults unless `replaceArrays` is set.
4. The options are applied: coverage (outside watch mode), the HTML report, `serial`, `watch` and the spec filter from `testPathPatterns` or the command line.

The promise resolves to Jest's results; a failure sets `process.exitCode = 1` without exiting the process.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
