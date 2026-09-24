# Plan 1: Unit test coverage for `packages/*`

Status: proposed
Order: first (Plan 2 and Plan 3 build on the safety net created here)
Owner: TBD

## 1. Goal

Cover every code package under `packages/` with deterministic unit tests, run through `@rockpack/tester` itself, and enforce coverage in CI.

| Package | `src` LOC | Files | Current tests | Target |
|---|---|---|---|---|
| `@rockpack/utils` | 64 | 7 | none | 95%+ |
| `@rockpack/babel` | 148 | 1 | 4 tests in `e2e/babel-e2e` | 90%+ |
| `@rockpack/tester` | 182 | 8 | none | 85%+ |
| `@rockpack/codestyle` | 316 | 2 | none | 85%+ |
| `@rockpack/starter` | 1252 | 23 | CLI smoke tests in `e2e/starter-e2e` | 85%+ |
| `@rockpack/compiler` | 2389 | 55 | none | 80-85% unit, plus integration |
| `@rockpack/tsconfig` | 0 | 0 | n/a | smoke test only (`tsc -p` on a fixture) |

Enforced thresholds (per package, `coverageThreshold.global`): statements 85, lines 85, functions 85, branches 80. Start at 80/80/80/75 while a package is being covered, then raise to the target in the last task of that package's phase. Thresholds only go up.

## 2. Non-goals

- No refactoring of production code beyond the enablers in Phase 0. Testability problems (argv parsed at import time, `process.exit` inside library code, mutable globals) are worked around with mocks here and fixed in Plan 3. Tests written now are the safety net for that refactor.
- No changes to `examples/*` or the starter templates. Their test-structure issues are handled in Plan 2.
- No visual or browser tests.

## 3. Ground rules

These apply to every spec written under this plan.

1. **Runner:** `@rockpack/tester`, invoked from `scripts.tests.ts` in each package (same convention as `examples/tester/*`). No direct `jest` binaries, no `vitest`.
2. **Layout:** specs are colocated next to the unit they test and share its basename: `src/modules/make-entry.ts` has `src/modules/make-entry.spec.ts`. Fixture projects live in `src/__fixtures__/<name>/` and are excluded from build, lint-ts and coverage.
3. **Structure (CLAUDE.md):**
   ```ts
   describe('makeEntry', () => {
     describe('negative cases', () => {
       it('exits when src is not a string', () => {});
     });

     describe('positive cases', () => {
       it('uses the dist basename as the entry name', () => {});
     });
   });
   ```
   Negative block first, positive second, blank line between them, even when one block has a single test.
4. **Determinism:** no network, no real free-port lookups, no real timers (`jest.useFakeTimers()`), no dependence on the machine's Chromium or ports. Filesystem work uses `fs.mkdtempSync(path.join(os.tmpdir(), 'rockpack-'))` and is removed in `afterEach`. `Math.random` is seeded or asserted by shape only.
5. **Mocks:**
   - ESM-only dependencies (`chalk`, `ora`, `inquirer`, `@inquirer/select`, `latest-version`, `change-case`, `sort-package-json`, ESLint flat plugins) are replaced with `jest.mock('<name>', () => factory)`. babel-jest hoists these, and the real module is never loaded, so the CJS transform never sees ESM syntax.
   - Modules with import-time state (`yargs(...).parseSync()` at module level in `utils/get-mode.ts`, `utils/set-mode.ts`, `compiler/index.ts`, `compiler/core/args.ts`, `compiler/modules/make-dev-server.ts`, `starter/utils/argv.ts`, `starter/utils/pathes.ts`, `tester/configs/config-compiler.ts`) are loaded inside `jest.isolateModules()` after `process.argv` / `process.cwd` have been arranged.
   - `process.exit` is always `jest.spyOn(process, 'exit').mockImplementation(() => { throw new ExitError(code) })` so that code after the call does not run. A shared helper `mockProcessExit()` lives in each package under `src/__fixtures__/process-exit.ts` (a small duplicated helper is acceptable until Plan 3 introduces a shared test-utils workspace).
   - `console.*` is silenced with `jest.spyOn(console, 'log').mockImplementation(() => {})` and asserted where the message is part of the contract.
6. **Typing:** no `any` in tests. Use `jest.Mocked<typeof mod>` / `jest.MockedFunction<typeof fn>`. Prefer `type` over `interface` in test helpers.
7. **Naming:** `it('<verb phrase describing behaviour>')`, no "should".
8. **One assertion theme per test.** Split tests instead of stacking unrelated expectations.

## 4. Phase 0: enablers

Small, additive changes that make the packages testable with the tester. Each item is verified by running `npm run build`, `npm test -w e2e/babel-e2e` and `npm test -w examples/tester/react` before moving on. Nothing here changes a public default in a way an existing consumer would notice, except item 0.3 (documented in CHANGELOG).

- [x] **0.1 `@rockpack/babel`: transform `import.meta` in test mode.**
  In `packages/babel/src/index.ts`, when `isTest` is true, also push `babel-plugin-transform-import-meta` (it is already a devDependency of babel, compiler and tester). Move it from `devDependencies` to `dependencies` in `packages/babel/package.json`. Reason: `import.meta.url` is used in 12 source files across babel, compiler, starter and tester, and babel-jest compiles to CJS where `import.meta` is a syntax error.
- [x] **0.2 `@rockpack/tester`: NodeNext-style imports and coverage settings.**
  In `packages/tester/src/configs/config-compiler.ts`:
  - add a default `moduleNameMapper` entry `'^(\\.{1,2}/.*)\\.js$': '$1'` so that `./core/init.js` imports in compiler and tester resolve to `.ts` sources (starter-e2e already passes this mapping by hand);
  - only apply `collectCoverage`, `coverageReporters` and `reporters` defaults when the user has not provided them (`config.coverageReporters ??= [...]`), and add `text-summary` and `lcov` to the default reporters list so CI can read the numbers;
  - keep `coverageThreshold`, `collectCoverageFrom` and `coverageDirectory` as pass-through (they already are).
- [x] **0.3 Keep spec files and fixtures out of build output.**
  - `packages/{babel,utils,tester,compiler}/scripts/build.ts` and `build.cjs.ts`: extend the file filter to skip `*.spec.ts(x)`, `*.test.ts(x)` and any path containing `__fixtures__`, `__tests__` or `__mocks__`.
  - `packages/compiler/src/utils/source-compile.ts`: pass the same patterns as the default `ignore` list to `getFiles` for TS, JS and copy globs. This also fixes the consumer-facing problem that `sourceCompiler` currently ships colocated specs into `lib`. Add a CHANGELOG entry.
  - `packages/utils/tsconfig.types.json`: add `"exclude": ["src/**/*.spec.ts", "src/__fixtures__"]` (it is the only `tsconfig.types.json` that includes globs instead of `src/index.ts`).
  - `.eslintflatignore`: add `packages/*/src/__fixtures__/**` and `packages/*/coverage`.
- [x] **0.4 Per-package test wiring** (babel, utils, tester, codestyle, starter, compiler):
  - `devDependencies`: `@types/jest` (same version as `packages/tester`), `@rockpack/tester: 8.0.0` (for babel, utils, codestyle, compiler, starter; tester tests itself through its own built `lib`).
  - `tsconfig.json`: `"types": ["node", "jest"]`.
  - `package.json` scripts: `"test": "tsx scripts.tests.ts"`, `"test:watch": "tsx scripts.tests.ts --watch"` (watch is read from `process.argv` inside the script, as `examples/tester/debug` does).
  - `scripts.tests.ts`:
    ```ts
    import { tester } from '@rockpack/tester';

    const watch = process.argv.includes('--watch');

    tester(
      { src: './src', watch },
      {
        collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.spec.ts', '!src/__fixtures__/**'],
        testEnvironment: 'node',
      },
    );
    ```
    `coverageThreshold` is not set here: `npm test` runs in the pre-push hook, and thresholds enforced before a package has specs would block every push. The first task of each package's phase adds `coverageThreshold: { global: { branches: 75, functions: 80, lines: 80, statements: 80 } }`, and the last task raises it to the phase's exit numbers.
  - `packages/codestyle/src/index.ts`: add an override for `**/*.spec.{ts,tsx}` and `**/__fixtures__/**` that enables jest globals and relaxes `@typescript-eslint/unbound-method` and `@typescript-eslint/no-empty-function` (`max-lines-per-function` is not enabled by the config, so it needs no override). Today jest globals are only enabled for JS files.
- [x] **0.5 Root scripts.**
  - `"test:unit": "lerna run test --scope=@rockpack/babel --scope=@rockpack/utils --scope=@rockpack/tester --scope=@rockpack/codestyle --scope=@rockpack/starter --scope=@rockpack/compiler"`.
  - `"test"` stays `lerna run test --stream` (it now includes the package tests).
  - Document in README "Contributing" that `npm run build` must precede `npm test` because the tester used by the packages is the built `packages/tester/lib`.
- [x] **0.6 Prove the pipeline** with one trivial spec per package (for example `utils/src/utils/get-major-version.spec.ts`) and confirm: `npm run build`, `npm run lint`, `npm run test:unit` all pass, coverage report is written to `packages/<name>/coverage`, and `lib/` contains no spec files.

## 5. Phase 1: `@rockpack/utils` (size S)

Order matters only for the first phase: utils is small and every other package depends on it, so its specs double as a template for the rest.

| Spec | Cases |
|---|---|
| `src/utils/get-major-version.spec.ts` | negative: invalid range throws `Invalid semver range`. positive: `'1.2.3'` gives 1, `'^18.0.0'` gives 18, `'>=2 <3'` gives 2. |
| `src/utils/get-mode.spec.ts` | Load inside `jest.isolateModules` with `process.argv` set. negative: `--mode=staging` (not in `modes`) falls back to default; `--mode` without value (parses to `true`) falls through to `NODE_ENV`. positive: `--mode=production` wins over `NODE_ENV`; `NODE_ENV=production` without flag; nothing set gives default; custom `modes`/`defaultMode` arguments. |
| `src/utils/set-mode.spec.ts` | Same matrix as `getMode`, plus assertions that `process.env.NODE_ENV` and `BABEL_ENV` are written. Restore env in `afterEach`. |
| `src/utils/require-dir.spec.ts` | Mock `node:fs.statSync`. negative: missing path makes `statSync` throw and the error propagates. positive: `argv[1]` is a file gives its dirname; is a directory gives itself; `argv[1]` undefined gives `process.cwd()`. |
| `src/polyfills/text-encoder.fix.spec.ts` | positive: after `require`, `global.TextEncoder === util.TextEncoder` and the same for `TextDecoder`. |
| `src/index.spec.ts` | positive: the barrel exports exactly `getMajorVersion`, `getMode`, `getRootRequireDir`, `setMode`. |

Exit: thresholds raised to 95/95/95/90.

Status: done on 2026-09-24. Actual coverage 100/100/100/100 (28 tests). `yargs` 18 is ESM-only, so `get-mode` and `set-mode` specs mock `yargs` and `yargs/helpers` and load the unit with `jest.isolateModules` + `jest.requireActual` after arranging the parsed argv (import-time parsing makes a top-level import hit the mock factory before `mockArgv` is initialised). Jest sets `NODE_ENV=test`, so specs clear and restore it explicitly.

## 6. Phase 2: `@rockpack/babel` (size S)

Single file, one spec `src/index.spec.ts`, with a helper that creates a temp project dir, writes an optional `package.json` and `rockpack.babel.js`, and points `process.cwd` at it via `jest.spyOn(process, 'cwd')`. Because `createBabelPresets` uses a real `createRequire`, `jest.mock` cannot intercept `rockpack.babel.js`; every case gets its own temp dir so the Node module cache never returns a stale config.

Negative cases:
- malformed `package.json` is swallowed and `corejs` is not set;
- `rockpack.babel.js` whose `require` throws logs via `console.error` and the default options are returned;
- `rockpack.babel.js` function returning `null` is caught (`Object.keys(null)` throws) and logged.

Positive cases:
- defaults: `framework: 'none'`, no react preset, preset-env with `browsers: ['> 5%']`, `modules: false`, pipeline/do-expressions/decorators plugins present, `env.production` is `{}`;
- `isNodejs: true` gives `targets: { node: 'current' }`;
- `modules: 'commonjs'` is forwarded to preset-env;
- `core-js` in `dependencies` gives `corejs: '<version>'` and `useBuiltIns: 'usage'` (only `dependencies` is read: `core-js` in `devDependencies` alone leaves polyfills off, pinned as a negative case);
- `framework: 'react'` puts `babel-plugin-react-compiler` first, adds `@babel/preset-react` with `runtime: 'automatic'`, sets `env.production.plugins` to the constant-elements plugin;
- `typescript: true` replaces preset-env with preset-typescript and adds `babel-plugin-transform-typescript-metadata`;
- `isTest: true` adds `@babel/plugin-transform-modules-commonjs` and (after 0.1) `babel-plugin-transform-import-meta`;
- `rockpack.babel.js` exporting an object is deep-merged (arrays concatenated, existing keys kept);
- exporting an empty object changes nothing;
- exporting a function receives `(ctx, opts, deepmerge)` and its non-empty return value replaces the options;
- function returning `{}` is ignored.

Assert on plugin/preset identity with `expect.stringContaining('babel-plugin-react-compiler')` because `_require.resolve` returns absolute paths.

After this phase, `e2e/babel-e2e` is redundant. Keep it until Plan 2 decides whether it stays as a smoke test of the built `lib` or is deleted.

Exit: thresholds 90/90/90/85.

Status: done on 2026-09-24. Actual coverage 100/100/100/100 (16 tests). `rockpack.babel.js` is loaded through the real `createRequire`, so each case writes it into its own `mkdtemp` project and points `process.cwd` there with `jest.spyOn`. The plan listed `core-js` in `devDependencies` as a positive case, but the code reads only `dependencies`; the spec pins the current behaviour and any change belongs to Plan 3 (B1/B3).

## 7. Phase 3: `@rockpack/tester` (size M)

The tester is tested by its own built `lib`, so `npm run build:tester` must run before `npm test -w packages/tester`. The test files import from `../src`, never from `lib`.

| Spec | Cases |
|---|---|
| `src/modules/create-test-match.spec.ts` | positive: one src, several srcs, custom prefix; negative: empty src array returns empty array. |
| `src/modules/file-transformer.spec.ts` | positive: `process(src, filename)` returns `module.exports = "<basename>"` for `/a/b/logo.svg`; negative: filename without directory. |
| `src/modules/identity-obj-proxy.spec.ts` | positive: any property returns its own name; `__esModule` returns false. |
| `src/default-props.spec.ts` | positive: defaults are `prefix '(spec|test)'`, `src './src'`, `watch false`. |
| `src/configs/config-compiler.spec.ts` | Load with `jest.isolateModules`. Mock `node:fs.existsSync`, `@rockpack/utils` (`getRootRequireDir` returns a fake project dir) and `@rockpack/babel` (`createBabelPresets` returns a marker object). negative: user `setupFilesAfterEnv` array replaces the polyfill entry (document the current behaviour); `prefix` and `src` from opts are the only way to influence `testMatch`. positive: no setup files detected; each of `jest.init`, `jest.setup`, `jest.global.setup`, `jest.global.teardown` for each of `.js/.mjs/.cjs/.ts`; `src` string vs array; `testEnvironment` override; `moduleNameMapper` deep-merge keeps css mapping and adds user keys; watch true gives `noCache: false`, `runInBand: false`, no forced coverage; watch false forces coverage and reporters (after 0.2: only when not provided); `coverageThreshold` passes through; returned `config` is valid JSON. |
| `src/core/init.spec.ts` | Mock `jest` (`runCLI`) and `process.exit`. negative: `results.success === false` logs the failure marker and exits 1; `runCLI` rejecting logs the error and exits 1. positive: success logs the success marker and does not exit; `runCLI` receives the compiled argv and `[process.cwd()]`. |
| `src/index.spec.ts` | Mock `./core/init` and `@rockpack/utils.setMode`. positive: `tester()` calls `setMode(['development','production','test'], 'test')` then `init` with merged options; negative: a rejected `init` is caught by `.catch(console.error)`. |

Exit: thresholds 85/85/85/80.

Status: done on 2026-09-24. Actual coverage 100/95.45/100/100 (46 tests); the only uncovered branch is the `.mjs` side of the `import.meta.url` extension check, which the CJS test build cannot reach. Found and fixed along the way: `configCompiler` returned `watch: undefined` instead of `false` when watch was not requested (`options.watch || opts['watch']`, and deep-extend copies explicit `undefined`); it is now `options.watch === true`. `@rockpack/codestyle` gained a `**/__fixtures__/**` override that turns off `@check-file/folder-naming-convention`, otherwise the fixture layout from ground rule 2 fails lint. The shared `mockProcessExit()` helper lives in `src/__fixtures__/process-exit.ts`.

## 8. Phase 4: `@rockpack/codestyle` (size M)

`makeConfig` imports about 17 ESLint plugins at module level, several of them ESM-only. Mock every plugin import with a factory that returns a minimal stub (`{ configs: {}, rules: {} }` or the shape `makeConfig` reads), and mock `eslint-config-flat-gitignore` with a `jest.fn()` that records its arguments. The test then asserts on the structure that `makeConfig` builds, not on ESLint internals.

`src/index.spec.ts`:
- negative: malformed `package.json` in cwd does not throw and yields the non-react config; no `tsconfig.json` and no `tsconfig.eslint.json` falls back to `./tsconfig.json` for `parserOptions.project`; `.eslintflatignore` absent all the way to the filesystem root yields an empty ignore config.
- positive: `react` in dependencies adds the react-hooks and `@eslint-react` block; `tsconfig.eslint.json` wins over `tsconfig.json`; `.eslintflatignore` found in cwd; found in an ancestor directory (temp dir with nested cwd); the returned array has the expected length and order; ts and js file globs; key rules present with expected severity (`check-file/filename-naming-convention` kebab-case, `@sonar/cognitive-complexity` 20, `no-console`); the `.d.ts` override disables `@import-lite/no-default-export`; the config-file override allows default exports for `eslint.config.*` and storybook files.
- `isString`: negative non-strings, positive strings.

Extract `findFlatIgnoreFile` and `readPackageJson` into small internal modules first only if it is a pure move with no behaviour change; otherwise test them through `makeConfig` with temp dirs.

Exit: thresholds 85/85/85/80.

## 9. Phase 5: `@rockpack/starter` (size L)

Work bottom-up: utils, then lib, then bin. ESM-only dependencies are mocked with factories in a shared `src/__fixtures__/mocks.ts` (chalk returns identity functions, ora returns an object with `start/succeed/fail/text`, `latest-version` returns a fixed version, `@inquirer/select` and `inquirer` return canned answers, `sort-package-json` is identity, `change-case.pascalCase` is the real implementation re-exported from a CJS-compatible copy or a small local implementation).

| Spec | Cases |
|---|---|
| `src/utils/copy.spec.ts` | temp dirs. positive: nested directories and files are copied; negative: missing source rejects. |
| `src/utils/pathes.spec.ts` | `jest.isolateModules` with `process.cwd` spied. positive: `'.'` resolves to cwd; a name resolves to `cwd/name`; `backbone/addons/dummies` point inside `templates`. |
| `src/utils/package-json.spec.ts` | positive: exposes the starter's own `name` and `version`. |
| `src/utils/other.spec.ts` | Mock `node:child_process.execSync` and argv. negative: `--yarn` with `yarnpkg --version` throwing gives npm; positive: no flag gives npm; `--yarn` with yarn available gives yarn; `getPMVersion` shape. |
| `src/utils/git.spec.ts` | Mock `execSync` and `existsSync`. negative: git missing; positive: `.git` found at start, at a parent, not found up to `/`; `makeRepo` runs `git init` in the given cwd and reports failures. |
| `src/utils/git-hooks.spec.ts` | Mock `spawnSync`. positive: asserts the exact sequence of spawn calls with and without tester. (The commands are known to be broken with npm 9 and husky 9. Lock the current behaviour now; Plan 3 replaces it.) |
| `src/utils/error.spec.ts` | Mock exit and `getPMVersion`. negative: exits with 1; positive: prints platform diagnostics; optional callback runs before exit. |
| `src/utils/project.spec.ts` | temp dirs plus mocked `latest-version` and `child_process.exec`. negative: unreadable package.json; invalid JSON; write failure; `exec` error surfaces. positive: `addDependencies` in test mode pins `@rockpack/*` to the starter version and never calls the network; outside test mode resolves majors through `latest-version`; empty groups are deleted; the koa `@types` key swap when both keys exist and when one is missing; `addFields`/`addScripts` merge; `installDependencies` uses npm vs yarn; `installPeerDependencies` returns early without peers. |
| `src/lib/get-args.spec.ts` | Mock `../utils/argv`. positive: `install === false`, `mode=test`, `tests` as `'true'`/`'false'`/`true`/other, valid `type`, `folder`; negative: invalid `type` and non-string folder are dropped. |
| `src/lib/wizard.spec.ts` | Mock prompts. negative: `ExitPromptError` in select exits 0; in confirm exits 0; other errors leave the value undefined. positive: pre-filled args skip prompts; select answer applied; confirm answer applied. |
| `src/lib/git-init.spec.ts` | Mock `../utils/git`. positive: git unavailable sets `nogit`; parent repo sets `nogit`; otherwise `makeRepo` is called. |
| `src/lib/copy-files.spec.ts` | Mock `../utils/copy`. negative: no `appType` returns without copying; positive: the four types, `nogit`, `tests` true/false produce the expected `copy` calls in order. |
| `src/lib/create-files.spec.ts` | temp target dir, real `templates/dummies`. negative: unreadable dummy calls `showError`; positive: `.env.example` renamed to `.env`; library and component build scripts with `%libraryName%`/`%componentName%` replaced; single-character numeric names get the `Library`/`Component` prefix; other types write nothing. |
| `src/lib/package-json-preparing.spec.ts` | Mock `../utils/project.addDependencies` (records groups). positive: each `appType` yields the expected scripts, `exports`/`main`/`types` fields, tester and git dependency groups, `pre-commit` script when git is enabled; negative: unknown `appType` adds nothing. |
| `src/lib/install.spec.ts` | Mock every collaborator module and use fake timers. negative: each `try/catch` step routes to `showError`; `noInstall` exits before any install; positive: full flow order for csr, ssr, library, component; `testMode`; `.git` already present; `nogit`; summary output per type. Advance timers to cover the spinner text callbacks. |
| `src/bin/rockpack.spec.ts` | Mock `../utils/argv`, `latest-version`, `node:fs`, `../lib/install`, exit. negative: no name exits 1; non-empty existing dir exits 1; positive: `-v`, `--version`, `-h`, `--help`; newer version prints the warning (note the inverted text; assert the current string and mark with a `// TODO Plan 2` comment); prerelease latest is ignored; `--folder`; `.` with `.git` uses the basename with spaces replaced; `.` without `.git` uses `app`. |
| `src/bin/index.spec.ts` | `jest.isolateModules` with `process.versions.node` patched. negative: Node below `minVer` exits 1; positive: otherwise `rockpack()` is called. |

Coverage exclusions: `src/types/**`, `src/declarations.d.ts`, `src/constants/**` (covered indirectly).

Exit: thresholds 85/85/85/80.

## 10. Phase 6: `@rockpack/compiler` (size XL)

Split into six work packages, each independently mergeable. The order goes from pure code to code that needs the most mocking.

### 6.1 Pure utilities (S)

`utils/asset-type`, `utils/collection` (constructor with function/array/object/primitive entries, `get/modify/remove/set`, thrown errors for missing names and non-function callbacks), `utils/compile-webpack-config` (null vs Collection for modules and plugins), `utils/generate-string` (length and charset), `utils/other` (`capitalize`, `getRandomInt` bounds, `getTitle` with null/no name/underscores, `getMajorVersion` including non-string input), `errors/*` (message factories), `constants`, `default-props`, `modules/make-devtool`, `modules/make-output` (absolute vs relative vs undefined dist, `pathinfo` by mode, `library` adds umd fields), `modules/make-resolve`, `modules/make-stats`, `modules/make-optimization` (dev object; prod with `debug` true/false; `vendor` cache groups in both modes; minimizer constructors mocked as `jest.fn` classes), `plugins/ssr-development/webpack-utils`.

### 6.2 Filesystem lookups (S)

Mock `node:fs.existsSync` with a path set. `utils/path-to-eslintrc` (precedence, last match wins), `utils/path-to-stylelint`, `utils/path-to-ts-conf` (full precedence matrix across mode and debug, none present gives `false`), `utils/get-node-modules` (mock `find-package-json`), `utils/find-free-port` (mock `find-free-port`, resolve and reject), `utils/file-system-utils` (temp dir: directories filtered, ts/tsx filter, ignore patterns), `utils/log` (mock `webpack-format-messages`: null stats, MultiStats, single Stats, errors vs none), `modules/make-banner` (mock `node:fs`: missing/empty banner gives false, placeholders replaced or blanked, empty lines removed; assert the path with `expect.stringContaining('banner')` because the relative path only resolves from `lib`), `modules/make-externals`, `modules/make-dev-server` (isolateModules for argv; `port` set vs free-port lookup; `_rockpack_testing` flag), `utils/merge-conf-with-default` (mock `fpPromise`; `.js` dist, folder dist, empty dist, port only in dev), `utils/get-styles-rules` (temp root with optional `postcss.config.js` and tsconfig; prod extract vs `styles: false`; dev; `debug`; TS dts loader; `__isIsomorphicStyles`), `utils/make-compiler-options` (fixture tsconfig; `dts/cjs/esm/default` formats; missing config throws).

### 6.3 Config assembly (M)

`modules/make-entry` (mock exit: non-string src; `vendor`; isomorphic frontend dev adds `dev-server` entry; dist basename as entry name; undefined dist), `modules/make-modules` (mock `getStylesRules`; all 25 rule keys present; `excludeModules` removes keys; `nodejs` forwarded to `createBabelPresets`), `modules/make-plugins` (mock every plugin module as a recording class, `node:fs.existsSync`, `fpPromise`, `pathTo*`, `makeBanner`; cover the 11 branch groups listed in the inventory: ForkTsChecker for TS projects; `.env` with `.env.example`/`.env.defaults` and the `process.env` definition removal; banner string/true/false/undefined; html false/isomorphic/array/object/true, default template and title, filename from template, version string; stylelint and eslint presence with `debug`; DefinePlugin values including `ROOT_DIRNAME` for backend; copy `{from,to}`/`{files,opts}`/array/empty; dev plugins for nodejs, isomorphic backend, watch-ignore, isomorphic styles; prod plugins with `styles` containing `.css`; analyzer dev vs prod; `getNodemonOptions` inspect port and message suppression), `core/inner-props` (not isomorphic; isomorphic backend flags; isomorphic frontend in dev vs prod; `html` undefined becomes false; unknown compilerName untouched), `core/args` (isolateModules; no flag; flag with isomorphic backend; flag otherwise), `core/make` (mock the `make*` modules, fs and utils: package.json present/absent, `name` string, `externals` override, `nodejs` vs isomorphic externals presets, dev vs prod output tweaks, `post` hook).

### 6.4 Runtime (M)

`core/run` (inject a fake webpack that captures the callback: dev with and without errors; prod error exits 1; prod success with `library` awaits `sourceCompiler` then exits 0; prod success without library), `core/dev-server` (mock `webpack-dev-server`; `startCallback` pushes messages; `messages` undefined), `core/compile` (mock `make`, `run`, `mergeConfWithDefault`, `getMode`; `CONFIG_ONLY` override; config-only result shape; run path), `error-handler` (spy `process.on`/`once`/`exit`: each handler logs; SIGINT/SIGTERM exit once), `compilers/frontend-compiler`, `backend-compiler`, `library-compiler` (string opts; object opts with externals; esm/cjs; invalid opts exit 1; `html` handling; `nodejs` flags), `isomorphic-compiler` (mock livereload, webpack, run, exit: void promises filtered; missing frontend or backend; missing `src`/`dist`; success passes the config list to `run`), `make-webpack-config`, `source-compiler` (mock `pathToTsConf`, `sourceCompile`, `generateDts`: esm/cjs/none; throw is logged; TS project runs dts; non-TS skips), `plugins/ssr-development/index` (mock `nodemon` with an EventEmitter: `apply` with hooks vs legacy `plugin`; `onAfterEmit` matrix; `startMonitoring` events; exit and SIGINT handlers), `plugins/reloader/ssr` (jsdom environment via `@jest-environment jsdom` docblock: no window, script already present, script appended).

### 6.5 Source compiler and d.ts (M)

`utils/source-compile` and `utils/generate-dts` against a fixture project in `src/__fixtures__/source-project/` (a few `.ts`, one `.tsx`, one `.js`, one asset, a `tsconfig.json`) compiled into a temp dir: only cjs, only esm, both; non-string `src` in a format object; TS vs JS-only vs empty source dir; empty babel result skipped; asset copy error caught; leftover `.js`/`.js.map` renamed; `debug`; `generateDts` with and without `types`, src with and without extension, missing tsconfig throws, temp folder removed. These run real Babel and TypeScript, so they are slower (seconds). Keep them under 10 tests.

### 6.6 Integration workspace `e2e/compiler-e2e` (M)

Superseded by [Plan 4, section 5](./04-e2e.md): the compiler e2e workspace is specified there in full. The paragraph below is kept as the original scope note.

Mirror `e2e/babel-e2e`: a workspace with `scripts.test.ts` running the tester in node environment against the built `@rockpack/compiler`. Fixture projects under `src/fixtures/{frontend,backend,library,isomorphic,source}`. Each test runs the real compiler in production mode into a temp `dist`, with `process.exit` stubbed, and asserts emitted files (`index.js`, `index.html`, css extraction, library `umd` wrapper, `types/*.d.ts`, sourcemaps by mode). One dev-mode test uses `makeWebpackConfig` only (no dev server). No browser. Budget: under two minutes total. This suite does not count toward the compiler unit thresholds; it protects the wiring the unit tests mock away.

Coverage exclusions for the compiler: `src/declarations.d.ts`, `src/globals.d.ts`, `src/types.ts`, `src/configs/postcss.config.cjs` (covered by a single smoke test but excluded from thresholds).

Exit: thresholds 80/85/85/80 (branches 80).

## 11. Phase 7: enforcement

- [ ] `npm run test:unit` added to the pre-push hook (Plan 2 replaces the full `npm test` there).
- [ ] CI job (defined in Plan 2) runs build, then `test:unit`, then `e2e/babel-e2e`, `e2e/compiler-e2e` and the tester examples, and uploads `coverage/lcov.info` per package.
- [ ] Final threshold pass: set each package's thresholds to `floor(actual) - 2`, never below 80/80/80/75, and record the numbers in this document.
- [ ] Remove or repurpose `e2e/babel-e2e` (decision recorded in Plan 2).

## 12. Acceptance criteria

1. Every file under `packages/*/src` (excluding declarations, types-only files and `__fixtures__`) has a colocated spec.
2. `npm run build && npm run lint && npm run test:unit` passes on a clean clone with no network access after install (verify with the network disabled).
3. Coverage thresholds are enforced per package through `coverageThreshold` and the run fails below them.
4. No spec, fixture or coverage artifact is present in any `lib/` or `types/` directory after `npm run build`, and `npm pack --dry-run` in each package lists none.
5. All specs follow the negative-first, positive-second structure.
6. Total unit run time under 90 seconds on a laptop (integration workspace excluded).

## 13. Suggested order and sizing

| Step | Size | Depends on |
|---|---|---|
| Phase 0 | M | nothing |
| Phase 1 utils | S | Phase 0 |
| Phase 2 babel | S | Phase 1 |
| Phase 3 tester | M | Phase 1 |
| Phase 4 codestyle | M | Phase 0 |
| Phase 5 starter | L | Phase 1 |
| Phase 6.1 to 6.5 compiler | XL | Phase 1 |
| Phase 6.6 compiler-e2e | M | 6.1 to 6.5 |
| Phase 7 | S | everything |

Phases 2 to 6 are independent of each other and can run in parallel branches once Phase 0 and Phase 1 are merged.

## 14. Risks

- **Circular test dependency.** Tester tests need a built tester, and babel/utils tests need built babel/utils because the tester imports them. Mitigation: CI always builds first; `scripts.tests.ts` prints a clear error when `packages/tester/lib` is missing.
- **Import-time side effects** make some specs depend on `jest.isolateModules`. These specs will be simplified in Plan 3 when argv parsing becomes lazy; keep them small so the rewrite is cheap.
- **Path assumptions** (`__dirname`-relative `../../..` in `make-banner`, `generate-dts`, `config-compiler`) differ between `src` and `lib`. Specs assert with `expect.stringContaining` and never depend on the real relative layout.
- **ESM-only dependencies** must always be mocked; a forgotten mock surfaces as "Cannot use import statement outside a module". The shared mocks file per package keeps this in one place.
- **Slow compiler integration tests.** Keep them in the separate workspace and outside `test:unit`.
