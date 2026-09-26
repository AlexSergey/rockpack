# Changelog

## [9.0.0]

Version 9.0.0 rewrites every package in TypeScript and moves the toolchain to Node.js 24.15, Babel 8, webpack-dev-server 6 and type checking with the project's own `tsc`. The compilers resolve to typed results and reject with typed errors instead of exiting the process, the build output comes from a new reporter, `@rockpack/codestyle` adds strict typescript-eslint presets and rules that catch bugs, and generated projects get git hooks, knip and live reload for SSR.

Upgrading from 8.x: see the [migration guide](./MIGRATION.md).

### Added
- All packages (`@rockpack/babel`, `@rockpack/codestyle`, `@rockpack/compiler`, `@rockpack/starter`, `@rockpack/tester`, `@rockpack/utils`) rewritten in TypeScript, with ESM and CommonJS builds (`@rockpack/codestyle` ships ESM only)
- `@rockpack/compiler`: `isomorphicCompiler({ frontend, backend, frontendCallback, backendCallback })` takes the two confs and builds them with an explicit context; the `IsomorphicCompilerOptions` type is exported
- `@rockpack/compiler` validates every documented option before building, `sourceCompiler` included, and reports all problems at once with their paths, for example `INVALID_CONFIG: html[1].template must be a string`
- `@rockpack/compiler` exports `RockpackError` (codes `INVALID_CONFIG`, `INVALID_ENTRY`, `BUILD_FAILED`, `DTS_FAILED`), the `RockpackErrorCode` type and the public types `CompilerConf`, `HtmlPage`, `CompilerCallback`, `Collection`, `Mode`, `CompilerResult` and `IsomorphicCompilerResult`
- `@rockpack/compiler`: the `modules` and `plugins` collections passed to the compiler callbacks are typed (`Collection<RuleSetRule>`, `Collection<WebpackPluginInstance>`); `get(name)` returns `[]` for a missing name
- `@rockpack/compiler`: `ignore` option (globs) for the per-file `esm`/`cjs` builds and the generated declarations; the default skips `*.spec.*`, `*.test.*`, `__fixtures__`, `__mocks__` and `__tests__`
- `@rockpack/compiler`: `cache: true` caches production builds on disk in `node_modules/.cache/rockpack`
- `@rockpack/compiler`: `sourceCompiler({ watch: true })` rebuilds the per-file formats and the declarations after every source change and resolves to a result with `stop()`
- `@rockpack/compiler` build reporter: a progress bar per compiler in a terminal (client and server rows in an isomorphic build), one summary line per build, every problem (syntax, missing module, TypeScript, ESLint, Stylelint, CSS) in one format, plain output without a terminal or in CI; `progress: false` turns the bars off
- `@rockpack/compiler`: the `nodejs` option is public (Node.js libraries), and `HtmlPage` honors `inject`, `minify` and `templateParameters` (merged over `version`)
- `@rockpack/compiler` picks up `postcss.config.cjs` and `postcss.config.mjs` next to `postcss.config.js`
- `@rockpack/babel` loads `rockpack.babel.js`, `.cjs`, `.mjs` or `.ts` (the first one found, in that order) and uses the default export of an ES module config; it exports the `BabelMergeContext`, `BabelMergeFunction`, `Framework`, `Modules`, `TypescriptOptions` and `CreateBabelPresetsOptions` types
- `@rockpack/babel`: `typescript: { env: true }` runs `@babel/preset-env` after `@babel/preset-typescript`, so `modules`, `isNodejs` and `core-js` apply to TypeScript; the merge context has `typescriptEnv`
- `@rockpack/babel/plugins/import-extension`: a Babel 7 and 8 plugin that gives relative imports the extension of a per-file build (`mjs`, `cjs`, `js`); the compiler and the Rockpack packages use it instead of the unmaintained `babel-plugin-add-import-extension`
- `@rockpack/babel` test mode transforms `import.meta` (for example `import.meta.url` and a module-level `const __filename = fileURLToPath(import.meta.url)`) so ES module sources run under Jest's CommonJS transform
- `@rockpack/codestyle`: `makeConfig({ ignoreFile, jest, react, tsconfig })` overrides the detection of the ignore file, the Jest rules, React and the tsconfig; the `MakeConfigOptions` type is exported
- `@rockpack/codestyle` reads ignore patterns from a `.eslintflatignore` file (`eslint-config-flat-gitignore`), searched from `process.cwd()` upward, so one file at a monorepo root covers every package
- `@rockpack/codestyle` exports the shared Stylelint and Commitlint configs from `@rockpack/codestyle/stylelint` (`stylelintConfig`) and `@rockpack/codestyle/commitlint` (`commitlintConfig`); generated projects use them, so their presets no longer have to be hoisted next to the project
- `@rockpack/codestyle` lints `.mts` and `.cts` files as TypeScript, turns off `@import-lite/no-default-export` and `@typescript-eslint/naming-convention` for `.d.ts` files and allows non-kebab-case folder names inside `__fixtures__`
- `@rockpack/tester`: `serial` option (one suite at a time, no cache), `coverage` option (`false`, or `{ collectCoverageFrom, reporters, thresholds }`) and a default `collectCoverageFrom` that counts every source file; the default coverage reporters add `text-summary` and `lcov`, and `collectCoverage`, `coverageReporters` and `reporters` from the Jest config are respected
- `@rockpack/tester` runs only the specs matching the positional command-line arguments or the `testPathPatterns` option, and reads `--watch` from the command line when `watch` is not passed
- `@rockpack/tester`: `esm: true` runs the specs as ES modules (no CommonJS transform, TypeScript treated as ESM) under `node --experimental-vm-modules`, and explains the flag when it is missing; `.mjs` and `.cjs` specs and modules are transformed like `.js`; relative `./x.js` imports resolve to `.ts` sources
- `@rockpack/tsconfig` ships `tsconfig.node.json`, a DOM-free variant for Node.js code
- `@rockpack/utils` exports `readPackageJson`, the `PackageJson` type, `packageRoot(import.meta.url)` and the `isRecord` and `isString` guards
- `@rockpack/utils`: `getMode` and `setMode` accept `{ argv, env }` to read from (and `setMode` to write to) instead of the process and return the mode typed as one of the given modes; `getRootRequireDir(script?)` takes the script path explicitly (defaults to `process.argv[1]`)
- `@rockpack/starter`: `--offline` writes the dependency ranges from `versions.json` without asking the registry and skips the update check (installing still needs the network); `-y`/`--yes` answers the remaining questions with the defaults (`csr`, with tests)
- `@rockpack/starter`: boolean flags (`--tests`, `--offline`, `--install`/`--no-install`, `--yarn`) accept `true`/`false`/`yes`/`no`/`1`/`0`, a bare flag means `true`; `--help` lists every flag
- Generated projects check their dependencies with knip: a `lint:deps` script, run by `lint`, and a `knip` section in `package.json` with the entries of the template
- Generated projects install git hooks with `simple-git-hooks` (`pre-commit` lint-staged, `commit-msg` commitlint, `pre-push` tests) and get a `.nvmrc` with the Node.js major the starter requires
- Generated projects declare the packages they use directly: `typescript`, `@types/node` (24, the Node.js major they run on), `@types/jest` with tests, `webpack` (for `webpack/module` types) in csr projects

### Changed
- **Breaking:** Node.js 24.15 or newer is required by every package and by the starter CLI, which also checks the minor version (Babel 8 needs 24.11; `eslint-plugin-package-json` and a dependency of `eslint-plugin-regexp` in `@rockpack/codestyle` need 24.15)
- **Breaking:** Babel 8 in every package (`@babel/core` 8 is ESM only): plugins added through `rockpack.babel.*` must support Babel 8, and the Babel types are `InputOptions` from `@babel/core` (`createBabelPresets` and `BabelMergeFunction` return them; `@types/babel__core` is gone)
- **Breaking:** `@rockpack/babel` no longer includes `@babel/plugin-proposal-pipeline-operator` (Babel 8 removed the `minimal` proposal); install it and add it with `proposal: 'hack'` or `'fsharp'` in `rockpack.babel.*`
- `@rockpack/babel`: decorators keep the legacy semantics through `version: 'legacy'` (Babel 8 ignores `legacy: true`); core-js polyfills come from `babel-plugin-polyfill-corejs3` (`usage-global`, same targets) instead of preset-env's removed `useBuiltIns`; preset-react runs through `@rockpack/babel/presets/react`, which keeps JSX parsing off for `.ts`, `.mts` and `.cts` files as Babel 7 did
- `@rockpack/babel`: development builds use React's `jsxDEV` runtime (preset-react 8 turns `development` on for the `development` env); production builds are unchanged
- `@rockpack/babel`: `react-compiler-runtime` is an optional peer dependency (only needed on React 17 and 18)
- **Breaking:** `frontendCompiler`, `backendCompiler` and `libraryCompiler` resolve to a typed result (`CompilerResult`: `config`, `build` with `stats` and `success`, `dev-server` with `url` and `stop()`, `watch` with `stop()`); an awaited production build now resolves after the build has finished, and the dev server result once it listens
- **Breaking:** `isomorphicCompiler` resolves to a result as well (`build` with `stats` and `success` once both production builds have finished, `watch` in development with `stop()`, which closes webpack, the server nodemon runs and the live reload server); it resolved before the build finished
- **Breaking:** the compilers no longer call `process.exit` on invalid options: they log `[rockpack] <code>: <message>`, set `process.exitCode = 1` and reject with a `RockpackError`
- **Breaking:** stricter option checks: values the compiler used to tolerate (for example `port: '3000'`) and an `esm`/`cjs` format without `src` or `dist` (in `sourceCompiler` and `libraryCompiler`) are rejected with `INVALID_CONFIG`; an `esm`/`cjs` `dist` that is the project root, the sources or a folder holding them is refused before anything is deleted
- **Breaking:** production builds finish by closing webpack and exit with code `1` when webpack reports errors (they exited with `0` before); `Ctrl+C` exits with `130`, `SIGTERM` with `143`; unexpected errors are no longer swallowed
- **Breaking:** `@rockpack/compiler` output changed: `@nuxt/friendly-errors-webpack-plugin` and `webpack-format-messages` are gone together with the `DONE Compiled successfully`, `[COMPILE] 0:3 minutes`, `Compiled successfully!` and `Failed to compile.` lines; the dev server URL is printed as `› Starting server on <url>` after the first build; the per-file builds report one `sources` line with a line per format, and `The distribution folder will be ...` became `› output: <file>`
- **Breaking:** `@rockpack/compiler` lints during the build only with `lint: true` (it ran ESLint and Stylelint whenever it found their configs); with the option it also finds `eslint.config.ts`/`.mts`/`.cts` and every Stylelint config name, and Stylelint checks only the sources; `eslint` and `stylelint` are optional peer dependencies
- **Breaking:** `@rockpack/compiler` no longer ships a bundle analyzer: the `analyzer` option (now reported as `INVALID_CONFIG` with a hint), the `--analyzer` flag, `webpack-bundle-analyzer` and `@statoscope/webpack-plugin` are removed; add the analyzer you want in the compiler callback
- **Breaking:** `@rockpack/compiler` runs webpack-dev-server 6 (Express 5, http-proxy-middleware 4, no SockJS, no `spdy`, no proxy `bypass`); custom `devServer` settings from the callback may need changes
- **Breaking:** `@rockpack/compiler` checks types with the project's own `tsc` (`tsc --noEmit -p tsconfig.json`, TypeScript 6 or 7) instead of `fork-ts-checker-webpack-plugin`: the build reports what `tsc --noEmit` reports, now also syntax errors of files outside the bundle and tsconfig errors; the plugin entry is `TypeCheckPlugin` (was `ForkTsCheckerPlugin`); declarations are emitted by the same `tsc` with the module resolution of the project's `tsconfig.json` (the forced `moduleResolution: "node"` and `baseUrl` are gone), and declaration errors fail the build with `DTS_FAILED` (they were silent)
- **Breaking:** `@rockpack/compiler` no longer installs `@rockpack/codestyle`, `cross-env`, `moment`, `colors`, `async` or the unused `null-loader`, `imports-loader`, `script-loader`, `svg-inline-loader` and `arraybuffer-loader`; projects that got them through the compiler must add them to their own dependencies
- **Breaking:** `name` and `library` are no longer part of the public `CompilerConf`: every compiler set them itself
- `@rockpack/compiler`: `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `SideEffectsFlagPlugin` and `NoEmitOnErrorsPlugin` are no longer in the `plugins` collection; the optimization settings apply them
- `@rockpack/compiler`: an isomorphic development build extracts CSS to the `styles` path like production (default `css/styles.css`), and the isomorphic build honors `debug` in its output
- `@rockpack/compiler`: the isomorphic compiler starts the live reload server only in development, on the first free port from 35729; the live reload client loads from the host name of the page instead of `localhost`
- **Breaking:** `@rockpack/codestyle` has no built-in ignore list: without a `.eslintflatignore` (or `makeConfig({ ignoreFile })`) build output, coverage and `.d.ts` files are linted
- **Breaking:** `@rockpack/codestyle` uses the typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` presets (was `recommended`, `stylistic` and `recommendedTypeChecked`) and adds `prefer-readonly` and `switch-exhaustiveness-check`; numbers are allowed in template literals, void arrow shorthands are allowed, `||` stays allowed for strings and `no-dynamic-delete` is off
- **Breaking:** `@rockpack/codestyle` requires `type` aliases instead of `interface` (`@typescript-eslint/consistent-type-definitions`), and `@typescript-eslint/explicit-function-return-type` is an error instead of a warning
- **Breaking:** `@rockpack/codestyle` adds rules that catch bugs: `eqeqeq` (`== null` allowed), `@typescript-eslint/no-shadow`, sonarjs bug detectors (`no-identical-conditions`, `no-all-duplicated-branches`, `no-duplicated-branches`, `no-element-overwrite`, `no-ignored-return`, `no-use-of-empty-return-value`, `non-existent-operator`, `no-collection-size-mischeck`, `no-empty-collection`, `no-unthrown-error`, `no-gratuitous-expressions`, `reduce-initial-value`), unicorn rules (`error-message`, `prefer-type-error`, `prefer-number-properties`, `prefer-structured-clone`, `no-useless-spread`, `no-useless-promise-resolve-reject`, `no-thenable`, `no-instanceof-builtins`, `no-await-in-promise-methods`, `no-single-promise-in-promise-methods`) and, in test files, a set of `eslint-plugin-jest` error rules (`no-done-callback`, `no-conditional-expect`, `no-identical-title`, `no-standalone-expect`, `valid-title`, `valid-expect`, `no-focused-tests`, `no-disabled-tests` and others)
- **Breaking:** `@rockpack/codestyle`: React projects lint their test files with `eslint-plugin-testing-library` (react preset) and `eslint-plugin-jest-dom` (recommended); the Jest, Testing Library and jest-dom rules apply to `*.{spec,test}.{js,jsx,ts,tsx}` (the Jest rules covered only `*.spec.{ts,tsx}`), and `jest: false` leaves all three out
- **Breaking:** `@rockpack/codestyle` no longer exports its internal `isString` helper; import `isString` from `@rockpack/utils`
- `@rockpack/codestyle` ships only the ESM build; `require('@rockpack/codestyle')` loads it through Node.js `require(esm)`; `eslint-plugin-json` is replaced by `@eslint/json`
- `@rockpack/codestyle/stylelint`: `stylelint-config-clean-order` 10 orders `top`, `right`, `bottom` and `left` after the logical `inset` properties, `text-wrap-*` after `text-wrap` and `stroke-color` with the SVG properties; `stylelint --fix` applies the new order
- `@rockpack/codestyle`: Prettier 3.9 moves an arrow function with a return type onto the line of the call it is passed to, and typescript-eslint 8.70 reports type parameters that default to `{}` (`no-generated-empty-object-type`); `eslint --fix` applies the formatting
- **Breaking:** `@rockpack/tester` runs suites in parallel with the Jest cache by default; pass `serial: true` for the previous one-by-one behaviour
- **Breaking:** `@rockpack/tester`: `setupFiles`, `setupFilesAfterEnv`, `moduleFileExtensions` and `testPathIgnorePatterns` from the Jest config extend the defaults instead of replacing them (the text-encoder polyfill stays); pass `replaceArrays: true` for the old behaviour
- **Breaking:** `@rockpack/tester`: `tester()` returns a promise of Jest's results (`undefined` when Jest could not run) and no longer calls `process.exit`; failures set `process.exitCode = 1`. Write `void tester(...)` in `scripts.tests.mts` (the `no-floating-promises` lint rule asks for it) or await it
- **Breaking:** `@rockpack/tester` no longer loads `jest.extend.js`/`.cjs` from the project root; pass that Jest config as the second argument, `tester({}, { ... })`
- `@rockpack/tester`: `jest.init.*` and `jest.setup.*` are referenced by absolute paths in the folder of the test script, so the script also works when run from another folder; the values of `--mode`, `--testNamePattern`/`-t` and `--config`/`-c` are no longer taken as spec path patterns; `typescript` is no longer a runtime dependency
- **Breaking:** `@rockpack/tsconfig` turns on `noPropertyAccessFromIndexSignature` (and states `useUnknownInCatchVariables`): read index signatures with brackets, for example `process.env['API_URL']`
- **Breaking:** `@rockpack/tsconfig` no longer turns off `strictPropertyInitialization`, so `strict` checks that class properties are initialized; the base config no longer sets `outDir`, and only `.`, `./tsconfig.json`, `./tsconfig.node.json` and `./package.json` can be imported from the package
- `@rockpack/utils` reads `--mode` without yargs and has no import-time side effects; the `PackageJson` type has `peerDependencies` and `engines` instead of `email`
- **Breaking:** `@rockpack/starter` rejects a project name that is not a valid npm package name (for example with capitals or spaces) and exits with code `1` listing the problems; `rockpack .` lower-cases the folder name
- `@rockpack/starter` exits with code `1` on an unknown or empty `--type` and on a non-boolean value of a boolean flag, and reports a project path that is a file; the update check compares versions with semver, works offline and is skipped with `--mode=test`
- `@rockpack/starter` can no longer be imported as a module (it only has the `rockpack` CLI) and no longer ships type declarations
- Generated projects run their build and test scripts with Node.js itself (`node scripts.build.mts`, `node scripts.tests.mts`) instead of `tsx`, which is no longer installed; the scripts are `.mts`, so Node.js treats them as ES modules without a `"type"` in `package.json`
- Generated components ship the UMD bundle and the type declarations only (the unpublished `lib/cjs` and `lib/esm` builds are gone); the csr template puts `react-dom/client` into the vendor bundle
- Generated projects get `.gitignore` and `.gitattributes` also inside an existing git repository or without git (only `git init` and the hooks are skipped); `.gitignore` covers the library build (`/lib`) and the ssr frontend build (`/public`)

### Fixed
- `@rockpack/compiler` per-file builds (`sourceCompiler`, `libraryCompiler` `esm`/`cjs`): asset imports such as `./styles.css` or `./data.json` keep their path (they got `.mjs`/`.cjs` appended), import attributes (`with { type: 'json' }`) are kept, a file wins over a folder of the same name (`./both` loaded `./both/index`), and dynamic `import('./x')` gets the extension too
- `@rockpack/compiler`: an ES module PostCSS config (`export default`) was loaded as its module namespace and its plugins were silently ignored
- `@rockpack/compiler`: a development build whose webpack config cannot be applied (a plugin throws) rejects with `BUILD_FAILED` and the real error instead of a later `TypeError`
- `@rockpack/compiler`: a library whose bundle has errors no longer builds the `esm`/`cjs` sources and declarations as well, so the errors are reported once
- `@rockpack/compiler`: a project with `.env.defaults` but no `.env` gets its variables inlined; before, the browser bundle kept raw `process.env.X` references
- `@rockpack/compiler`: production builds for Node.js (`backendCompiler`, the backend of `isomorphicCompiler`, `nodejs` libraries) keep `console` calls; they were dropped like in browser bundles, so server logs disappeared
- `@rockpack/compiler`: the `banner` file is published, banner placeholders are filled by name, and the banner and default `index.ejs` are found from the package root; `index.ejs` has one viewport meta tag
- `@rockpack/compiler`: `distContext` is the dist folder when `dist` is a folder; the `.wasm` rule matches `.wasm` files; library source and declaration build errors fail the build instead of being swallowed
- `@rockpack/compiler`: the Babel plugins `sourceCompile` resolves at runtime are regular dependencies
- `@rockpack/compiler`: the `vendor` option moves the listed modules into `vendor.js` only (the main entry now `dependOn`s it); before, they were bundled into both files
- `@rockpack/compiler`: `isomorphicCompiler` fails with `INVALID_CONFIG` when the frontend and the backend write to the same file (one bundle silently overwrote the other)
- `@rockpack/compiler`: `sourceCompiler` and `libraryCompiler` no longer build an `esm`/`cjs` format with empty paths, whose output cleanup deleted the project folder
- `@rockpack/compiler` keeps no state on `global` (`ISOMORPHIC`, `CONFIG_ONLY`, `LIVE_RELOAD_PORT`, `LIVE_RELOAD_SERVER` are gone), and the plugin builders no longer change the passed conf (`banner`, `global`)
- `@rockpack/compiler`: watching builds ignore the folders they write (the output folders, `node_modules/.cache`); in an isomorphic build every emit and type check triggered more rebuilds of both compilers
- `@rockpack/compiler`: isomorphic live reload fires once nodemon has spawned the restarted server, and the client waits until that server answers before it reloads the page (it reloaded too early: on the connection error page or with the old server's markup)
- `@rockpack/codestyle`: the `eslint-plugin-react-hooks` rules (rules of hooks, exhaustive deps and the React Compiler rules) were dropped for React projects because the `@eslint-react` preset was spread over them; they are a block of their own now, and `@eslint-react/rules-of-hooks` is off because it reported the same problems
- `@rockpack/codestyle` sets `tsconfigRootDir`, so one ESLint run over files under several tsconfig folders no longer fails with "multiple candidate TSConfigRootDirs"
- `@rockpack/codestyle`: `require()` failed with `ERR_PACKAGE_PATH_NOT_EXPORTED` because the CommonJS build required the ESM-only `@eslint-react/eslint-plugin`
- `@rockpack/tester`: when the tester was imported as an ES module and Jest ran with `--experimental-vm-modules`, style imports failed with `exports is not defined`; Jest now always gets the style and file stubs from the CommonJS build
- `@rockpack/tester`: under `node --experimental-vm-modules` Jest loads `.mjs` files as ES modules, which failed with `exports is not defined` because the tester turned them into CommonJS; `.mjs` files now keep `import`/`export` there
- `@rockpack/tester`: `watch` is always a boolean
- `@rockpack/babel`: an ES module `rockpack.babel.js` was merged as its module namespace, adding a `default` key to the Babel options; a broken `rockpack.babel.*` now prints the underlying error
- `@rockpack/starter`: an absolute `--folder` was joined onto the current folder
- `@rockpack/starter`: `-h`/`--help` and `-v`/`--version` print the Rockpack usage and version instead of the yargs defaults; a missing yarn is reported once without a stack trace, and a failed git hooks install warns
- Generated components keep the peer dependency ranges (`"react": "19"`); they were pinned to the exact latest version, which locked consumers to it, and they are no longer installed twice
- Generated projects without tests have no failing `test` script, generated libraries have no `lint:styles`/`format:styles` scripts, and `rockpack .` names the project after the folder with or without a git repository (it was `app` outside git)
- Generated libraries and components publish only their built files, and the component `types` path points at the emitted declarations; the example app of a library has its own `package.json` again (the template overwrote it with a broken one)
- Generated projects: git hooks work with npm 9+ (husky's removed `set-script`/`add` commands are gone); `format` and `lint` use the chosen package manager
- Generated ssr, component and library projects without tests no longer reference `jest` types they do not install
- Generated csr and ssr projects pass `value` to `UnheadProvider` (the `head` prop is deprecated), have no `main: index.js`, and the csr build reads `package.json` next to its script
- Generated ssr projects listen on `PORT` from `.env` (the template shipped `PORT=8888` but always listened on `4000`), stop loading when a request fails, resolve `babel-loader` and `babel-jest` through `@rockpack/compiler` and `@rockpack/tester`, and reload the browser page in development again: the template loads `dev-server.js`, the live reload client the compiler builds
- Generated projects: the tester setup reads `.env.test` with `process.loadEnvFile` instead of importing the undeclared `dotenv`

### Deprecated
- `libraryCompiler('MyLib', ...)`: pass `{ name: 'MyLib' }` (the `LibraryCompilerOptions` type is exported). The string form keeps working until 10.0
- `isomorphicCompiler(frontendCompiler(...), backendCompiler(...))`: pass the confs instead, `isomorphicCompiler({ frontend: {...}, backend: {...} })`, moving each compiler's callback to `frontendCallback`/`backendCallback`. The old form keeps working until 10.0
- `@rockpack/babel`: TypeScript without `typescript: { env: true }` (preset-env skipped for TypeScript); `env: true` becomes the default in 10.0

### Removed
- **Breaking:** generated projects have no `analyzer` script (the compiler has no analyzer any more)
- The csr and ssr templates no longer ship the `FeatureCard` and `SpotlightSection` components, which no page rendered
- The SSR template no longer ships a `rockpack.babel.js` (custom Babel config through `rockpack.babel.*` is still supported by `@rockpack/babel`) and no longer depends on the unused `react-router-dom`

## [8.0.0]

Version 8.0.0 is a major modernization release: the toolchain has been updated to support ESLint 10, TypeScript 6, and Tailwind CSS v4, while legacy and unmaintained integrations have been removed. It also introduces first-class AI-assisted development support, making Rockpack a solid foundation for teams working with tools like Claude Code.

### Added
- Adapted for AI-assisted development: preconfigured CLAUDE.md with quality gates, minimal-diff rules, and cost-efficient workflows for Claude Code and similar AI tools
- Tailwind CSS v4 support
- eslint-plugin-no-only-tests, eslint-plugin-import-lite, eslint-plugin-sonarjs, eslint-plugin-unicorn

### Changed
- Codestyle module reworked for ESLint 10 support
- Full TypeScript 6+ support
- Minimum Node.js version raised to 23
- Improved debugging in production
- Dependency updates

### Fixed
- Fixed d.ts generation for CSS Modules

### Removed
- Removed handlebars, pug, markupCompiler, webViewCompiler, outdated webpack plugins, and bower support

## [7.2.0]

- Updated all dependencies
- Fixed json linter
- Eslint was update to 10

## [7.1.0]

- Updated all dependencies
- Disabled package-json/require-type rule in codestyle
- Fixed breaking changes in rockpack/starter

## [7.0.0]

- Added React Compiler support
- Updated all dependencies
- Fixed security vulnerabilities
- Removed outdated code
- Improved overall performance

## [6.0.0]

- React 19 supports in all templates
- All dependencies were updated
- Fix vulnerabilities issues
- Templates simplification
- Performance improvements

## [5.0.0]

- Zero vulnerabilities for all packages
- Replaced imagemin to sharp
- Dropped mandatory "I" prefix for interfaces
- Dropped deprecated babel plugins
- Removed unused modules
- Dropped addons from tester package. Improves customization.
- Added support CJS and ESM types for library template
- Added Updater module to update dependencies automatically

## [4.5.0]

- Templates were refactored
- Changed react-router notation to the object style
- All dependencies were updated

## [4.4.0]

- ESLint 9 support
- Refactoring
- All dependencies were updated

## [4.3.0]

- ESLint 9 preparation for use
- Bug fixing
- Refactoring
- All dependencies were updated

## [4.2.0]

- Fixed bugs in **libraryCompiler**
- Provided ability to modify modules and plugins in compilers. The example for the customization compiler was updated
  regarding these changes.

## [4.1.0]

- Added [eslint-plugin-regexp](https://github.com/ota-meshi/eslint-plugin-regexp)
- Added [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)

## [4.0.0]

- A lot of fixes and optimizations
- Rework [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module:
  - Added [eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist)
  - Turned off all conflicts rules
  - Updated all deprecation warnings from Stylelint
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module integrated to each of project
- React Pure project added (include React, React-Dom only)
- Adopt the code to use [iSSR](https://github.com/AlexSergey/issr) the new version
- All dependencies were updated

## [3.0.0]

- A lot of fixes and optimizations
- The new [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module with best practices
   - Prettier added
   - Stylelint added
   - Commitlint added
   - Lintstaged added
   - Replaced simple-git-hooks to husky
- Typescript by default
- All dependencies were updated

## [2.0.0]

- A lot of fixes and optimizations
- All dependencies were updated
- The new React application templates
- webpack-plugin-serve -> webpack-dev-server4
- [the new official site](https://alexsergey.github.io/rockpack/)

## [1.9.0]

- babel config extend added

## [1.8.0]

- webpack-dev-server -> webpack-plugin-serve
- @rockpack/compiler simplification
- @rockpack/webpack-plugin-ussr-development added

## [1.6.1]

- Babel-ussr-plugin -> babel-plugin-ussr-marker

## [1.6.0]

- Babel-ussr-plugin added
- ts-loader, ts-jest -> @babel/preset-typescript

## [1.5.0]

- Simplification of USSR's api
- Small fixes
- added: Articles, [the official site](http://rockpack.io/)

## [1.1.0]

- fix(@rockpack/compiler): Side effects
- Small fixes
- added: Backbone for E2E tests

BREAKING CHANGES:

- Simplification of USSR API
- .modules.(s)css/less -> .module.(s)css/less (create-react-app compatibility)

## [1.0.0]
