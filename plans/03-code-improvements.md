# Plan 3: Code improvements, optimisation and TypeScript coverage

Status: in progress (started 2026-09-24)
Order: third, after Plan 1 (tests) and Plan 2 (recommendations)
Owner: TBD

## 1. Goal

With the unit tests in place and the audit findings closed, improve the packages themselves: architecture that is testable without mocks, public APIs that are safe to use programmatically, faster builds and test runs, and a measurable TypeScript quality bar. Every change here is covered by the Plan 1 tests; a change that needs a test rewrite is a signal to look at the API again.

## 2. Non-goals

- No new features for end users beyond what the API clean-up implies (for example returning promises).
- No migration to another bundler or test runner.
- No changes to the starter templates' stack (React, Koa, Tailwind stay).

## 3. Ground rules

- Behaviour-preserving refactors first, API changes second, and each API change is listed in CHANGELOG under `9.0.0` with a migration note.
- Keep files under 250 lines and functions under the sonar complexity limit of 20 without disable comments.
- `type` over `interface`, no `any`, no `as unknown as`, `readonly` on every config type that the packages only read.
- All compiler functions stay `async` (see the memory note "Compiler functions stay async").

## 4. Measuring TypeScript coverage

- [x] **T1. Baseline.** Add `type-coverage` at the root (`npx type-coverage --strict --detail --ignore-files 'packages/*/src/**/*.spec.ts'` per package) and record the numbers in this document. Add a `"type-coverage"` script that fails below 99% per package (`--at-least 99`) once the baseline is reached; run it in the CI `check` job. _Done 2026-09-24: `type-coverage` 2.30.1 at the root, config in each package's `typeCoverage` (strict, `atLeast: 99`, specs, fixtures, mocks and `types/` ignored), `npm run type-coverage` runs in the CI `check` job. Baseline: babel 100% (245/245), codestyle 100% (397/397), compiler 99.26% (4055/4085), starter 99.52% (2087/2097), tester 99.51% (414/416), utils 100% (208/208); the remaining misses are type assertions, which C1, C9 and U1 remove._
- [x] **T2. Compiler strictness.** Enable `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch` and `useUnknownInCatchVariables` in `@rockpack/tsconfig` (the latter is already implied by `strict`; make it explicit). Fix the resulting errors package by package. `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are already on. _Done 2026-09-24: `noFallthroughCasesInSwitch` was already on; the flag broke 34 places (utils `process.env`, codestyle and starter index signatures, five examples, book, the ssr template), all switched to bracket access; checked that DefinePlugin and dotenv inline `process.env['X']`. Listed as breaking in CHANGELOG._
- [x] **T3. typescript-eslint preset.** Switch codestyle to `strictTypeChecked` plus `stylisticTypeChecked` (currently a hand-picked set). Turn on `@typescript-eslint/no-unnecessary-condition`, `switch-exhaustiveness-check`, `prefer-readonly`, `explicit-module-boundary-types` (public API only). Apply the autofixes and review the rest. _Done 2026-09-24: 147 new errors across the repo; `restrict-template-expressions` allows numbers, `no-confusing-void-expression` ignores arrow shorthands, `prefer-nullish-coalescing` ignores strings, `no-dynamic-delete` and `non-nullable-type-assertion-style` (conflicts with `no-non-null-assertion`) are off, `no-extraneous-class` is off in `.d.ts`; the rest fixed in code. Findings: dead webpack 4 branch in `SsrDevelopment`, redundant checks in banner, starter and babel, `Promise<X | void>` public types became `| undefined`, deprecated `UnheadProvider head` in the templates and book. Two public generics keep a disable (`getArgs<T>`, `Collection.modify<T>`). `explicit-module-boundary-types` is left to T5 (`isolatedDeclarations` covers it)._
- [ ] **T4. Public API type tests.** Add `expect-type` (or `tsd`) tests next to the public entry points: `CompilerConf`, `TesterOptions`, `CreateBabelPresetsOptions`, `makeConfig` return type, the starter `Args`. They compile as part of `lint:ts` and catch accidental widening (for example `html: boolean | HtmlPage | HtmlPage[]` losing a member).
- [ ] **T5. Declaration output.** Turn on `isolatedDeclarations` in each package's `tsconfig.types.json` and add the explicit return types it demands. Faster `build:types` and no inferred `any` leaks into `types/`.

## 5. `@rockpack/compiler`

### 5.1 Context instead of globals (L)

- [ ] **C1.** Replace `global.ISOMORPHIC`, `CONFIG_ONLY`, `LIVE_RELOAD_PORT`, `LIVE_RELOAD_SERVER` with a `CompileContext` object created once per compiler invocation and threaded through `compile`, `make`, `make*` modules and `run`. `isomorphicCompiler` builds the context and passes it to both child compilers instead of relying on the microtask ordering that currently makes `innerProps` observe the global after it was set. Delete `globals.d.ts`.
- [x] **C2.** Parse argv lazily in one place: `src/core/argv.ts` exporting `getArgv()` with a memo that tests can reset. Remove the module-level `yargs(...).parseSync()` in `index.ts`, `core/args.ts` and `modules/make-dev-server.ts`. Same treatment for `errorHandler` (register once, idempotent). _Done 2026-09-24: `src/core/argv.ts` (`getArgv()` memoised, `resetArgv()` for tests) replaces the three import-time `parseSync()` calls; `getArgs<T>()` returns `Argv & T`; the args and dev-server specs mock `getArgv` instead of reloading modules with `jest.isolateModules`; `errorHandler` was already registered once._
- [ ] **C3.** Run `mergeConfWithDefault` once (it runs in `compile` and again in `make`, repeating the free-port lookup and the "dist is a folder" log). Compute `pathToTsConf` once per invocation and store it on the context (called from five places today). _Partly done 2026-09-24: `make` no longer merges the defaults a second time (it receives the merged conf from `compile`). Computing `pathToTsConf` once waits for the C1 context._
- [x] **C4.** `defaultProps` is a shared mutable object; freeze it (`as const satisfies Partial<CompilerConf>`) and always spread. _Done 2026-09-24: `defaultProps` is frozen and typed `as const satisfies`; it was only read through `deepExtend` into a new object, so nothing mutated it._

### 5.2 Module structure (M)

- [ ] **C5.** After the Plan 2 split of `make-plugins.ts`, do the same for `modules/make-modules.ts` (190 LOC, 25 rule keys): `rules/scripts.ts`, `rules/styles.ts`, `rules/assets.ts`, `rules/misc.ts`, each exporting a typed record, and `makeModules` composing them. Remove the unused `_packageJson` parameter and the unused `_conf, _mode, _root` in `compileWebpackConfig`.
- [ ] **C6.** `utils/source-compile.ts` (156 LOC, sonar disabled): extract `transpileFile`, `copyAssets`, `renameOutputs`; `utils/generate-dts.ts` (95 LOC, sonar disabled): extract `emitDeclarations` and `copyDeclarations`. Both keep their tests from Plan 1 Phase 6.5.
- [ ] **C7.** `Collection` (`utils/collection.ts`): give it a generic parameter for the entry type so `modules` and `plugins` collections are typed (`Collection<RuleSetRule>`, `Collection<WebpackPluginInstance>`), removing the `as` casts in `compile-webpack-config.ts` and `make.ts`.
- [x] **C8.** Asset paths: resolve `index.ejs`, `banner` and `configs/postcss.config.cjs` from `import.meta.url` through one `packageRoot()` helper so `src` and `lib` layouts behave the same; this also lets tests run without `expect.stringContaining` workarounds. _Done 2026-09-24: `index.ejs` and `banner` already resolved through `compilerRoot()`; `postcss.config.cjs` moved from `src/configs` (copied into each `lib/<format>`) to the package-level `configs/`, published through `files`, so all three resolve the same from `src` and `lib`. The make-banner spec keeps `stringContaining` because it mocks `node:fs`, which `packageRoot` also uses._

### 5.3 Public API (M)

- [ ] **C9.** `frontendCompiler`/`backendCompiler`/`libraryCompiler` return a typed discriminated union: `{ kind: 'config', conf, webpackConfig } | { kind: 'build', stats } | { kind: 'dev-server', server, stop(): Promise<void> }` instead of `CompileResult | RunResult | void`. The dev-server variant exposes `stop()` so tests and scripts can shut it down; today only a process exit does.
- [ ] **C10.** `libraryCompiler` options: accept only the object form (`{ name, esm?, cjs?, externals? }`), keep the string form as a deprecated overload for one major.
- [ ] **C11.** `sourceCompiler({ ignore })` option (defaults from Plan 1 Phase 0.3) and a `watch` mode using `@parcel/watcher` (already a transitive dependency through nx) or `chokidar`, so codestyle and starter get a `build:watch`.
- [ ] **C12.** Options validation: replace the ad-hoc `isString`/`isObject` checks with one `validateConf(conf)` that returns a list of `RockpackError`s (from Plan 2 F1) with the offending path (`html[1].template`), and call it once in `compile`.

### 5.4 Performance (S)

- [ ] **C13.** Dev mode: cache `find-free-port` results per port within one process; batch the three lookups (dev server, analyzer, nodemon inspect) into one call.
- [ ] **C14.** Production: enable webpack `cache: { type: 'filesystem' }` scoped to `node_modules/.cache/rockpack` for repeated builds (already used in dev); measure with `examples/compiler/react-app` before and after and record the numbers here.
- [ ] **C15.** `generateDts` writes into `node_modules/.rockpack/<random>` and copies; write directly to `conf.types` with `outDir` and skip the copy and `rimraf`.

### 5.5 Found by Plan 4 e2e (S to M)

- [ ] **C16.** Lint during builds never runs in Rockpack projects: `pathToEslintrc` only knows `eslint.config.{js,json,mjs,cjs}` and `pathToStylelint` only `.stylelintrc` and `stylelint.config.js`, while templates and examples use `eslint.config.ts` and `.stylelintrc.cjs`. Supporting them turns lint errors into build failures for every generated project, so it needs a decision; the README section still describes `.eslintrc.js`.
- [ ] **C17.** `stylelint-webpack-plugin` cannot `require('stylelint')` under `tsx` (`ERR_PACKAGE_PATH_NOT_EXPORTED` for `unicorn-magic/node`); run the build scripts on Node's own TypeScript support or load stylelint through `import()`.
- [ ] **C18.** A clean TypeScript build with CSS modules fails the type check until `dts-css-modules-loader` has written the declarations (the second build passes); generate them before the checker runs or ship them like the component template does.
- [ ] **C19.** Production builds drop `console.*` in Node backends too (`drop_console` unless `debug`), so server logs disappear; limit it to browser targets.
- [ ] **C20.** dotenv is enabled only when `.env` exists, so a project with `.env.defaults` alone gets raw `process.env.X` in the browser bundle.

- [ ] **C21.** `makeCompilerOptions` sets `moduleResolution: 'node'` and `baseUrl`, both deprecated in TypeScript 6 and removed in 7; move the d.ts and source builds to `node16`/`bundler` and check the emitted declarations.

## 6. `@rockpack/tester`

- [ ] **T6.** `tester()` returns `Promise<AggregatedResult>` and never calls `process.exit` itself; the decision to exit moves to the caller (`scripts.tests.ts` template: `tester().then(r => process.exit(r.success ? 0 : 1))`, or `process.exitCode`). Keep a `tester.run()` alias for scripts that do not await.
- [ ] **T7.** `configCompiler` becomes pure: it receives `{ cwd, projectDir, ext }` and returns `{ argv, config }` with no `existsSync` at import time; detection of `jest.setup.*`/`jest.init.*` happens inside the function. This removes the last `jest.isolateModules` from the tester specs.
- [ ] **T8.** Options: `serial` (from Plan 2 I4), `coverage: boolean | CoverageOptions` (reporters, thresholds, `collectCoverageFrom`), `watch` read from `--watch`, `esm: boolean` that enables `extensionsToTreatAsEsm` plus `--experimental-vm-modules` guidance and adds `.mjs`/`.cjs` to `moduleFileExtensions` and the transform map.
- [ ] **T9.** Array merge semantics: user `setupFilesAfterEnv`, `moduleNameMapper` and `transform` extend the defaults instead of replacing arrays (deep-extend replaces arrays today), with a documented `replace: true` escape hatch.
- [ ] **T10.** Drop `text-encoder.fix` if Node 24 plus jsdom 26 provide `TextEncoder` globally (verify in the react example with the polyfill removed); otherwise keep it.

## 7. `@rockpack/babel`

- [ ] **B1.** Split `createBabelPresets` (148 LOC, sonar disabled) into `readCoreJsVersion`, `buildPlugins`, `buildPresets`, `applyUserConfig`, each exported for tests; `createBabelPresets` composes them.
- [ ] **B2.** Export the types consumers need in `rockpack.babel.ts`: `BabelMergeContext`, `BabelMergeFunction`, `Framework`, `Modules`. Support `rockpack.babel.{js,cjs,mjs,ts}` through `jiti` or `tsx` import, and unwrap `default` when the loaded module is an ES namespace (today an ESM config falls into the object branch and merges a `default` key).
- [ ] **B3.** TypeScript mode: use `@babel/preset-typescript` together with `@babel/preset-env` so `modules`, `isNodejs` and `core-js` are honoured for TS projects (they are silently ignored today). This is a behaviour change: guard it behind `typescript: { env: true }` in `9.0.0` and make it the default in `10.0.0`, or document it as the `9.0.0` breaking change. Decide and record here.
- [ ] **B4.** Replace `deepmerge` with the same merge helper the tester uses (or the reverse), so the monorepo has one deep-merge dependency.

## 8. `@rockpack/utils`

- [x] **U1.** `getMode(options?: { argv?: string[]; env?: NodeJS.ProcessEnv })` and `setMode` on top of it (Plan 2 H2 does the lazy part; this adds injection so callers and tests pass values explicitly). _Done 2026-09-24: `getMode(modes, defaultMode, { argv, env })` with overloads (`getMode()` returns `DefaultMode`), `setMode` generic and writing to the given env; the compiler's six `as Mode` casts are gone (type coverage 99.26% to 99.40%)._
- [x] **U2.** Add `readPackageJson` (Plan 2 H1), `packageRoot(importMetaUrl)` (used by compiler C8, tester, starter `pathes.ts`), and `isRecord`/`isString` guards so `valid-types` can be dropped everywhere. _Done 2026-09-24: `packageRoot`, `isRecord` (plain objects, same as `valid-types` `isObject`) and `isString` in utils; the compiler uses them plus built-ins in 13 files and drops `valid-types`; `compilerRoot()` is `packageRoot(import.meta.url)`. The starter keeps its own `root` (correct for `src` and `lib`, and the CLI does not depend on utils); the tester's `rootFolder` is its build folder on purpose (T7). The replacement surfaced a typed-as-required `dist`/`src` check and an unsafe factory call in `Collection`, both now explicit._
- [x] **U3.** `getRootRequireDir` depends on `process.argv[1]`, which is the `tsx` script path in practice; document it or replace call sites with an explicit `cwd`/`projectDir` argument (tester T7 does this). _Done 2026-09-24: documented as "the folder of the running build script" (deliberately not `process.cwd()`, so a build started elsewhere still reads the project next to its script) and given an optional explicit `script` argument; the call sites keep the default._

## 9. `@rockpack/codestyle`

- [ ] **S1.** `makeConfig(options?: { react?: boolean; tsconfig?: string; ignoreFile?: string | false; jest?: boolean })` so consumers can override the auto-detection (package.json `react` sniffing, tsconfig lookup, `.eslintflatignore` walk).
- [ ] **S2.** Ship the configs the README promises or drop the dependencies (Plan 2 C4 leaves them): export `stylelintConfig` (`stylelint-config-clean-order`, `stylelint-scss`) and `commitlintConfig` from `@rockpack/codestyle/stylelint` and `@rockpack/codestyle/commitlint` subpaths, with a smoke test each.
- [ ] **S3.** After the Plan 2 H4 split, add a unit test per rule group that snapshots the rule names (not severities) so accidental rule drops are visible in review.
- [ ] **S4.** Make ESM-only plugin imports lazy (`await import`) behind `makeConfigAsync`, or accept that `makeConfig` stays sync and keep the jest mocks; decide based on ESLint's flat-config support for async configs (supported since ESLint 9).

## 10. `@rockpack/starter`

- [ ] **ST1.** Templating: replace the `%libraryName%` string replacement with a tiny render step (`{{name}}` in `templates/dummies/*` via a 10-line replacer) so more fields (author, description, license) can be filled from prompts.
- [x] **ST2.** Add an `--offline` flag that resolves every dependency from `versions.json` majors as `^<major>.0.0` without touching the registry. `--mode=test` keeps resolving current versions inside majors, because Plan 4 `latest` mode relies on it; Plan 4 `pinned` mode pins versions on the test side. _Done in Plan 4 section 4.5 (2026-09-24): `--offline` writes the ranges from `versions.json` as they are (not `^<major>.0.0`) and skips the update check._
- [ ] **ST3.** Wizard on `@inquirer/*` only (Plan 2 C5), with `--yes` to accept defaults and input validation for the project name (`validate-npm-package-name`).
- [ ] **ST4.** `install.ts` (259 LOC): extract `prepareProjectDir`, `writeMetaFiles`, `installAll`, `printSummary`; replace the three 60-second `setTimeout` spinner texts with one progress helper; remove `process.exit` from `install` and `rockpack.ts` and return a result the bin turns into an exit code.
- [ ] **ST5.** Share the byte-identical csr and ssr template `components/` directories (`templates/backbone/shared/components`) with `copyFiles` copying the shared dir first; the 8 duplicated spec files collapse to 4.
- [ ] **ST6.** Generated projects: pin exact versions in the generated `package.json` (the starter already computes them) and write a `.nvmrc` matching the starter's engine.

- [ ] **ST7.** Found by Plan 4: projects without tests keep npm's failing default `test` script; library projects declare `lint:styles` and `format:styles` without styles; `rockpack .` outside a git repository names the project `app` instead of the directory.

## 11. Build and repository tooling

- [ ] **R1.** `book` build in CI: switch `book/scripts.build.ts` prerender to puppeteer's bundled headless Chromium, and have `pages.yml` build `book` into `docs/` at deploy time so `docs/` is no longer committed (plans live in `plans/` at the repository root).
- [ ] **R2.** Turborepo or nx task caching for `build`, `lint`, `test` (lerna 9 already ships nx; enable `useNx` caching with `nx.json` and the `lib`/`types`/`coverage` outputs). Record cold vs warm timings here.
- [ ] **R3.** `updater.ts`: after Plan 2 B4, add `--filter <glob>` to update a subset and `--interactive` for majors (using `@inquirer/checkbox`), and make it write `CHANGELOG.md` stubs for major bumps.
- [ ] **R4.** `cloc.ts` spawns a system `cloc` binary; replace with a Node implementation (`sloc` or a 30-line walker) so `npm run cloc` works on any machine, or delete it.
- [ ] **R5.** Publish provenance: `npm publish --provenance` from the CI release job with `id-token: write`, and a release workflow triggered by a tag that runs build, lint, test, then `lerna run production`.

## 12. Documentation

- [ ] **D4.** Found by Plan 4: `@rockpack/utils` and `@rockpack/tsconfig` publish no README, and `@rockpack/codestyle` exports its internal `isString`.
- [ ] **D1.** Architecture note per package in its README ("how a build is assembled", "how the tester builds the jest config"), generated diagrams optional.
- [ ] **D2.** Migration guide `9.0.0` listing every API change from Plan 2 F and Plan 3 C9, C10, T6, B3.
- [ ] **D3.** Keep this document updated: check items off, record measured numbers (type coverage, build timings, test run time).

## 13. Acceptance

1. `type-coverage --strict` at or above 99% per package and enforced in CI.
2. No `@sonar/cognitive-complexity` or `max-lines` disables anywhere under `packages/*/src`.
3. No module under `packages/*/src` reads `process.argv` or `process.env` at import time (`grep -n "parseSync()" packages/*/src` at module level returns nothing).
4. No `global.` reads or writes in `@rockpack/compiler`.
5. All Plan 1 thresholds still hold, and the tester specs no longer use `jest.isolateModules`.
6. `npm run build` warm time and `npm run test:unit` time recorded and not worse than the Plan 1 baseline.

## 14. Suggested order

| Step | Items | Size |
|---|---|---|
| 1 | T1, T2, T3 (measure first, then tighten) | M |
| 2 | U1, U2, U3 | S |
| 3 | C1, C2, C3, C4, C8 (compiler internals) | L |
| 4 | T6, T7, T8, T9 (tester API) | M |
| 5 | C5, C6, C7, C9 to C12 | L |
| 6 | B1 to B4, S1 to S4 | M |
| 7 | ST1 to ST6 | L |
| 8 | C13 to C15, R1 to R5, T4, T5 | M |
| 9 | D1 to D3 | S |
