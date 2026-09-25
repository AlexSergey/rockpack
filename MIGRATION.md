# Migrating to Rockpack 9.0.0

This guide lists every change in `9.0.0` that can break an existing project, grouped by package, with what to change. The full list of changes is in the [CHANGELOG](./CHANGELOG.md).

## All packages

- **Node.js 24 or newer** is required by every package and by the starter CLI. Update Node.js (`.nvmrc` in generated projects says `24`) before upgrading the packages.
- Packages ship ESM and CommonJS builds; `@rockpack/codestyle` ships only ESM and is loaded by `require()` through Node.js `require(esm)`.

## @rockpack/compiler

### Compilers resolve to a typed result

`frontendCompiler`, `backendCompiler` and `libraryCompiler` resolve to a `CompilerResult` told apart by `kind`: `build` (`stats`, `success`), `config` (`webpackConfig`), `dev-server` (`url`, `stop()`) or `watch` (`stop()`). An awaited production build resolves after webpack has finished, and a dev server once it listens.

```ts
// Before: the promise resolved early and carried nothing useful
await frontendCompiler(conf);

// After
const result = await frontendCompiler(conf);
if (result.kind === 'build' && !result.success) {
  // webpack reported errors
}
if (result.kind === 'dev-server') {
  await result.stop();
}
```

### Errors and exit codes

- Invalid options no longer call `process.exit`. The compiler logs `[rockpack] <code>: <message>`, sets `process.exitCode = 1` and rejects with a `RockpackError` (`code` is `INVALID_CONFIG`, `INVALID_ENTRY`, `BUILD_FAILED` or `DTS_FAILED`). Scripts that must stop immediately on a bad option catch the rejection.
- A production build with webpack errors exits with code `1` (it exited with `0`). CI jobs that relied on a green exit code despite errors now fail, as they should.
- `Ctrl+C` exits with `130` and `SIGTERM` with `143`.

### Deprecated call forms (work until 10.0)

```ts
// Before
libraryCompiler('MyLib', conf);
isomorphicCompiler(frontendCompiler(frontendConf, frontendCallback), backendCompiler(backendConf, backendCallback));

// After
libraryCompiler({ name: 'MyLib' }, conf);
isomorphicCompiler({ backend: backendConf, backendCallback, frontend: frontendConf, frontendCallback });
```

### Output changes worth checking

- The `vendor` option moves the listed modules into `vendor.js` only; they are no longer bundled into both files.
- `sourceCompiler`/`libraryCompiler` skip an `esm` or `cjs` format without `src` or `dist` instead of building it with empty paths.
- Test files (`*.spec.*`, `*.test.*`, `__fixtures__`, `__mocks__`, `__tests__`) are no longer compiled or copied into the output, and no declarations are emitted for them; use the new `ignore` option to change the list.
- Declarations are generated with the module resolution of your own `tsconfig.json` (the forced `moduleResolution: "node"` and `baseUrl` are gone).
- Node.js production builds (`backendCompiler`, `nodejs` libraries) keep `console` calls; browser builds still drop them unless `debug` is on.

## @rockpack/tester

- `tester()` returns a promise of Jest's results (`undefined` when Jest could not run) and never calls `process.exit`; a failure sets `process.exitCode = 1`. Write `void tester(...)` in `scripts.tests.ts` (the `no-floating-promises` rule asks for it) or await it.
- Suites run in parallel with the Jest cache. Pass `serial: true` to run them one by one without cache as before.
- `setupFiles`, `setupFilesAfterEnv`, `moduleFileExtensions` and `testPathIgnorePatterns` from your Jest config are added to the defaults instead of replacing them. Pass `replaceArrays: true` to replace them as before.
- `jest.extend` is gone.

```ts
// scripts.tests.ts
import { tester } from '@rockpack/tester';

void tester({ serial: true }, { setupFilesAfterEnv: ['./jest.setup.ts'] });
```

## @rockpack/codestyle

- TypeScript files are linted with the typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` presets plus `prefer-readonly` and `switch-exhaustiveness-check`. Expect new findings on upgrade; run `eslint . --fix` first and fix the rest.
- `type` aliases are required instead of `interface` (`@typescript-eslint/consistent-type-definitions`); `eslint --fix` converts them.
- The internal `isString` helper is no longer exported; import it from `@rockpack/utils`.
- Stylelint and Commitlint configs are shipped by the package. Replace the preset lists in your own configs with:

```js
// .stylelintrc.cjs
module.exports = require('@rockpack/codestyle/stylelint').stylelintConfig;

// .commitlintrc.cjs
module.exports = require('@rockpack/codestyle/commitlint').commitlintConfig;
```

## @rockpack/tsconfig

`noPropertyAccessFromIndexSignature` is on: read index signatures with brackets, for example `process.env['API_URL']` (webpack and dotenv still inline them). To keep the old behaviour set `"noPropertyAccessFromIndexSignature": false` in your `tsconfig.json`.

## @rockpack/babel

- `rockpack.babel.js` may also be `.cjs`, `.mjs` or `.ts`; an ES module config uses its default export. A config that relied on the namespace object being merged (a `default` key in the Babel options) no longer gets that key.
- The `BabelMergeContext`, `BabelMergeFunction`, `Framework` and `Modules` types are exported for typed configs.
- TypeScript mode still ignores `modules`, `isNodejs` and `core-js` unless you pass `typescript: { env: true }`. In 10.0 this becomes the default; opt in now to check the output.

## @rockpack/utils

- `getMode` and `setMode` accept `{ argv, env }` to read from, and `getMode()` returns `'development' | 'production'`.
- `getRootRequireDir(script?)` takes the script path explicitly (defaults to `process.argv[1]`).
- Reading `--mode` no longer uses yargs, and importing the package has no side effects.

## @rockpack/starter

- The project name must be a valid npm package name (lower case, no spaces); the CLI exits with code `1` and lists the problems otherwise. `rockpack .` lower-cases the folder name.
- `-y`/`--yes` answers the remaining questions with the defaults (`csr`, with tests).
- Generated projects run `scripts.build.ts` and `scripts.tests.ts` with `node` instead of `tsx` (Node.js 24 strips the types itself; the scripts use `createRequire` instead of `require`). Existing projects can keep `tsx`.
- Generated projects: no failing `test` script without tests, no style scripts in libraries, a `.nvmrc`, component peer dependencies kept as ranges, and the Stylelint/Commitlint configs taken from `@rockpack/codestyle`.
