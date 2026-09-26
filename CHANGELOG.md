# Changelog

## [9.0.0] - Work in Progress

Full TypeScript migration across all packages, modernized build pipeline, and improved developer experience.

Upgrading from 8.x: see the [migration guide](./MIGRATION.md).

### Added
- All packages (babel, codestyle, compiler, starter, tester, utils) rewritten in TypeScript
- New build pipeline using `tsx` scripts for all packages and examples
- Dual ESM/CJS output for all packages except `@rockpack/codestyle` (ESM only)
- Improved tester configuration with better type support for Jest
- `eslint-config-flat-gitignore` integration in `@rockpack/codestyle` - ignore patterns are now loaded from `.eslintflatignore` file instead of being hardcoded
- `.eslintflatignore` support: `makeConfig` searches for the file recursively from `process.cwd()` upward, enabling monorepo setups where a single file at the repo root covers all packages
- ESLint rules `@import-lite/no-default-export` and `@typescript-eslint/naming-convention` are now disabled for `.d.ts` files
- `@rockpack/codestyle` enables Jest globals for `*.spec.{ts,tsx}` and `__fixtures__` files and turns off `@typescript-eslint/no-empty-function` and `@typescript-eslint/unbound-method` there
- `@rockpack/codestyle` lints specs with `eslint-plugin-jest` (`no-disabled-tests`, `no-focused-tests`, `valid-expect`, `prefer-to-have-length`) and allows non-kebab-case folder names inside `__fixtures__`
- `@rockpack/compiler`: `ignore` option (globs) for the per-file `esm`/`cjs` builds and the generated declarations, instead of the fixed specs/tests/fixtures list
- `@rockpack/compiler` validates every documented option before building and reports all problems at once with their paths, for example `INVALID_CONFIG: html[1].template must be a string`
- `@rockpack/compiler`: the `modules` and `plugins` collections passed to the compiler callbacks are typed (`Collection<RuleSetRule>`, `Collection<WebpackPluginInstance>`); `get(name)` returns `[]` for a missing name
- `@rockpack/compiler`: `isomorphicCompiler({ frontend, backend, frontendCallback, backendCallback })` takes the two confs and builds them with an explicit context; the `IsomorphicCompilerOptions` type is exported
- `@rockpack/compiler` exports `RockpackError` (codes `INVALID_CONFIG`, `INVALID_ENTRY`, `BUILD_FAILED`, `DTS_FAILED`) and the `RockpackErrorCode` type
- `@rockpack/tester`: `serial` option (one suite at a time, no cache) and a default `collectCoverageFrom` that counts every source file
- `@rockpack/tester` reads `--watch` from the command line when `watch` is not passed
- `@rockpack/tester` runs only the specs matching the positional command-line arguments or the `testPathPatterns` option
- `@rockpack/tester`: `coverage` option (`false`, or `{ collectCoverageFrom, reporters, thresholds }`); `.mjs` and `.cjs` specs and modules are transformed like `.js`
- `@rockpack/starter`: `--offline` writes the dependency ranges from `versions.json` without asking the registry and skips the update check
- `@rockpack/babel` loads `rockpack.babel.js`, `.cjs`, `.mjs` or `.ts` (the first one found, in that order) and uses the default export of an ES module config; it exports the `BabelMergeContext`, `BabelMergeFunction`, `Framework` and `Modules` types
- `@rockpack/codestyle`: `makeConfig({ ignoreFile, jest, react, tsconfig })` overrides the detection of the ignore file, the Jest rules, React and the tsconfig; the `MakeConfigOptions` type is exported
- `@rockpack/codestyle` exports the shared Stylelint and Commitlint configs from `@rockpack/codestyle/stylelint` (`stylelintConfig`) and `@rockpack/codestyle/commitlint` (`commitlintConfig`); generated projects use them, so their presets no longer have to be hoisted next to the project
- Generated projects get a `.nvmrc` with the Node.js major the starter requires
- `@rockpack/starter`: `-y`/`--yes` answers the remaining questions with the defaults (`csr`, with tests)
- `@rockpack/babel`: `typescript: { env: true }` runs `@babel/preset-env` after `@babel/preset-typescript`, so `modules`, `isNodejs` and `core-js` apply to TypeScript (they were ignored); the `TypescriptOptions` type is exported and the merge context has `typescriptEnv`. Planned as the default for 10.0
- `@rockpack/compiler`: `cache: true` caches production builds on disk in `node_modules/.cache/rockpack` (warm builds of the react-app example: 2.3 s to 1.6 s)
- `@rockpack/codestyle` lints `.mts` and `.cts` files as TypeScript
- `@rockpack/compiler`: `sourceCompiler({ watch: true })` rebuilds the per-file formats and the declarations after every source change and resolves to a result with `stop()`
- `@rockpack/tester`: `esm: true` runs the specs as ES modules (no CommonJS transform, TypeScript treated as ESM) under `node --experimental-vm-modules`, and explains the flag when it is missing
- `@rockpack/compiler` build reporter: a progress bar per compiler in a terminal (client and server rows in an isomorphic build), one summary line per build, every problem (syntax, missing module, TypeScript, ESLint, Stylelint, CSS) in one format, plain output without a terminal or in CI; `progress: false` turns the bars off
- `@rockpack/tsconfig` ships `tsconfig.node.json`, a DOM-free variant for Node.js code
- `@rockpack/utils` exports `readPackageJson` and the `PackageJson` type
- `@rockpack/utils`: `getMode` and `setMode` accept `{ argv, env }` to read from (and `setMode` to write to) instead of the process, and return the mode typed as one of the given modes (`getMode()` returns `'development' | 'production'`)
- `@rockpack/utils` exports `packageRoot(import.meta.url)` and the `isRecord` and `isString` guards; `@rockpack/compiler` no longer depends on `valid-types`
- `@rockpack/utils`: `getRootRequireDir(script?)` takes the script path explicitly (defaults to `process.argv[1]`)
- Generated projects install git hooks with `simple-git-hooks` (`pre-commit` lint-staged, `commit-msg` commitlint, `pre-push` tests)
- `@rockpack/babel/plugins/import-extension`: a Babel 7 and 8 plugin that gives relative imports the extension of a per-file build (`mjs`, `cjs`, `js`); the compiler and the Rockpack packages use it instead of the unmaintained `babel-plugin-add-import-extension`

### Changed
- All internal scripts migrated to TypeScript (`scripts.build.ts`, `scripts.tests.ts`)
- Updated examples to use latest React and TypeScript
- Build process now cleans output before each build
- Compiler configuration API improved: removed private internal fields
- **Breaking:** Node.js 24.15 or newer is required by every package and by the starter CLI, which also checks the minor version (Babel 8 needs 24.11, `eslint-plugin-package-json` and `eslint-plugin-regexp` in `@rockpack/codestyle` need 24.15); `engine-strict` is on in the monorepo
- **Breaking:** `frontendCompiler`, `backendCompiler` and `libraryCompiler` resolve to a typed result (`CompilerResult`: `config`, `build` with `stats` and `success`, `dev-server` with `url` and `stop()`, `watch` with `stop()`); an awaited production build now resolves after the build has finished, and the dev server result once it listens
- **Breaking:** the compilers no longer call `process.exit` on invalid options: they log `[rockpack] <code>: <message>`, set `process.exitCode = 1` and reject with a `RockpackError`
- **Breaking:** production builds finish by closing webpack and exit with code `1` when webpack reports errors (they exited with `0` before); `Ctrl+C` exits with `130`, `SIGTERM` with `143`; unexpected errors are no longer swallowed
- **Breaking:** `@rockpack/tester` runs suites in parallel with the Jest cache by default; pass `serial: true` for the previous one-by-one behaviour
- **Breaking:** `@rockpack/tester`: `setupFiles`, `setupFilesAfterEnv`, `moduleFileExtensions` and `testPathIgnorePatterns` from the Jest config extend the defaults instead of replacing them (the text-encoder polyfill stays); pass `replaceArrays: true` for the old behaviour
- **Breaking:** `@rockpack/tester`: `tester()` returns a promise of Jest's results (`undefined` when Jest could not run) and no longer calls `process.exit`; failures set `process.exitCode = 1`. Write `void tester(...)` in `scripts.tests.ts` (the `no-floating-promises` lint rule asks for it) or await it
- **Breaking:** `@rockpack/compiler` lints during the build only with `lint: true` (it ran ESLint and Stylelint whenever it found `eslint.config.{js,mjs,cjs}`, `.stylelintrc` or `stylelint.config.js`); with the option it also finds `eslint.config.ts`/`.mts`/`.cts` and every Stylelint config name, and Stylelint checks only the sources
- **Breaking:** `@rockpack/compiler` no longer ships a bundle analyzer: the `analyzer` option (now reported as `INVALID_CONFIG` with a hint), the `--analyzer` flag, `webpack-bundle-analyzer` and `@statoscope/webpack-plugin` are removed; add the analyzer you want in the compiler callback (see MIGRATION.md)
- **Breaking:** Babel 8 in every package (`@babel/core` 8 is ESM only and needs Node.js 24.11): plugins added through `rockpack.babel.*` must support Babel 8, and the Babel types are `InputOptions` from `@babel/core` (`createBabelPresets` and `BabelMergeFunction` return them; `@types/babel__core` is gone)
- **Breaking:** `@rockpack/babel` no longer includes `@babel/plugin-proposal-pipeline-operator` (Babel 8 removed the `minimal` proposal); add it with `proposal: 'hack'` or `'fsharp'` in `rockpack.babel.*`
- **Breaking:** `@rockpack/compiler` runs webpack-dev-server 6 (Express 5, http-proxy-middleware 4, no SockJS, no `spdy`, no proxy `bypass`); custom `devServer` settings from the callback may need changes, see the migration guide
- **Breaking:** `@rockpack/compiler` checks types with the project's own `tsc` (`tsc --noEmit -p tsconfig.json`, TypeScript 6 or 7) instead of `fork-ts-checker-webpack-plugin`: the build reports what `tsc --noEmit` reports (the `rootDir` layout aside), now also syntax errors of files outside the bundle and tsconfig errors; the plugin entry is `TypeCheckPlugin` (was `ForkTsCheckerPlugin`); declarations are emitted by the same `tsc` instead of the TypeScript API, so the compiler no longer needs the TypeScript 6 API
- `@rockpack/babel`: decorators keep the legacy semantics through `version: 'legacy'` (Babel 8 ignores `legacy: true`); core-js polyfills come from `babel-plugin-polyfill-corejs3` (`usage-global`, same targets) instead of preset-env's removed `useBuiltIns`; preset-react runs through `@rockpack/babel/presets/react`, which keeps JSX parsing off for `.ts`, `.mts` and `.cts` files as Babel 7 did
- `@rockpack/babel`: development builds use React's `jsxDEV` runtime (preset-react 8 turns `development` on for the `development` env); production builds are unchanged
- **Breaking:** `@rockpack/compiler` output changed: `@nuxt/friendly-errors-webpack-plugin` and `webpack-format-messages` are gone together with the `DONE Compiled successfully`, `[COMPILE] 0:3 minutes`, `Compiled successfully!` and `Failed to compile.` lines; the dev server URL is printed as `› Starting server on <url>` after the first build; the per-file builds no longer list their files between `=========` lines but report one `sources` line with a line per format, and `The distribution folder will be ...` became `› output: <file>`
- **Breaking:** `@rockpack/starter` rejects a project name that is not a valid npm package name (for example with capitals or spaces) and exits with code `1` listing the problems; `rockpack .` lower-cases the folder name
- **Breaking:** `@rockpack/codestyle` no longer exports its internal `isString` helper; import `isString` from `@rockpack/utils`
- **Breaking:** `@rockpack/codestyle` requires `type` aliases instead of `interface` (`@typescript-eslint/consistent-type-definitions`)
- **Breaking:** `@rockpack/codestyle` uses the typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` presets (was `recommended`, `stylistic` and `recommendedTypeChecked`) and adds `prefer-readonly` and `switch-exhaustiveness-check`; numbers are allowed in template literals, void arrow shorthands are allowed, `||` stays allowed for strings and `no-dynamic-delete` is off
- `@rockpack/codestyle/stylelint`: `stylelint-config-clean-order` 10 orders `top`, `right`, `bottom` and `left` after the logical `inset` properties, `text-wrap-*` after `text-wrap` and `stroke-color` with the SVG properties; `stylelint --fix` applies the new order
- `@rockpack/codestyle`: Prettier 3.9 moves an arrow function with a return type onto the line of the call it is passed to, and typescript-eslint 8.70 reports type parameters that default to `{}` (`no-generated-empty-object-type`); `eslint --fix` applies the formatting
- **Breaking:** `@rockpack/tsconfig` turns on `noPropertyAccessFromIndexSignature` (and states `useUnknownInCatchVariables`): read index signatures with brackets, for example `process.env['API_URL']`; webpack and dotenv still inline them. To keep the old behaviour set `"noPropertyAccessFromIndexSignature": false` in your `tsconfig.json`
- `@rockpack/babel`: `react-compiler-runtime` is an optional peer dependency (only needed on React 17 and 18); unused dependencies were removed from babel, compiler, codestyle, tester, utils and starter
- `@rockpack/babel` test mode keeps a module-level `const __filename = fileURLToPath(import.meta.url)` working under `@rockpack/tester`
- `@rockpack/utils` reads `--mode` without yargs and has no import-time side effects
- The isomorphic compiler starts the live reload server only in development
- The isomorphic compiler's live reload server takes the first free port from 35729 instead of failing when that port is busy
- Generated projects run their build and test scripts with Node.js itself (`node scripts.build.mts`, `node scripts.tests.mts`) instead of `tsx`, which is no longer installed; under `tsx` the Stylelint plugin could not load `stylelint`. The scripts are `.mts`, so Node.js treats them as ES modules without a `"type"` in `package.json`
- The starter update check compares versions with semver, says when a newer version is available, works offline and is skipped with `--mode=test`
- `@rockpack/starter` exits with code `1` and lists the valid types when `--type` is unknown
- The csr template puts `react-dom/client` into the vendor bundle
- `@rockpack/codestyle` ships only the ESM build; `require('@rockpack/codestyle')` loads it through Node.js `require(esm)`

### Fixed
- `@rockpack/compiler` per-file builds (`sourceCompiler`, `libraryCompiler` `esm`/`cjs`): asset imports such as `./styles.css` or `./data.json` keep their path (they got `.mjs`/`.cjs` appended), import attributes (`with { type: 'json' }`) are kept, a file wins over a folder of the same name (`./both` loaded `./both/index`), and dynamic `import('./x')` gets the extension too
- `@rockpack/codestyle` sets `tsconfigRootDir`, so one ESLint run over files under several tsconfig folders (for example a package and its templates) no longer fails with "multiple candidate TSConfigRootDirs"
- `@rockpack/compiler`: `analyzer: true` failed with `StatoscopeWebpackPlugin is not a constructor` when the compiler was loaded as an ES module (a build script run by `node` instead of `tsx`)
- `@rockpack/tester`: when the tester was imported as an ES module and Jest ran with `--experimental-vm-modules`, style imports failed with `exports is not defined`; Jest now always gets the style and file stubs from the CommonJS build
- `@rockpack/tester`: under `node --experimental-vm-modules` Jest loads `.mjs` files as ES modules, which failed with `exports is not defined` because the tester turned them into CommonJS; `.mjs` files now keep `import`/`export` there
- `@rockpack/compiler`: a project with `.env.defaults` but no `.env` gets its variables inlined; before, the browser bundle kept raw `process.env.X` references
- `@rockpack/compiler`: production builds for Node.js (`backendCompiler`, the backend of `isomorphicCompiler`, `nodejs` libraries) keep `console` calls; they were dropped like in browser bundles, so server logs disappeared
- `@rockpack/starter`: generated components keep the peer dependency ranges (`"react": "19"`); they were pinned to the exact latest version, which locked consumers to it
- `@rockpack/starter`: generated projects without tests have no failing `test` script, generated libraries have no `lint:styles`/`format:styles` scripts, and `rockpack .` names the project after the folder with or without a git repository (it was `app` outside git)
- `@rockpack/babel`: an ES module `rockpack.babel.js` was merged as its module namespace, adding a `default` key to the Babel options
- `@rockpack/compiler`: the `banner` file is published, banner placeholders are filled by name, and the banner and default `index.ejs` are found from the package root
- `@rockpack/compiler`: `distContext` is the dist folder when `dist` is a folder; the `.wasm` rule matches `.wasm` files; library source and declaration build errors fail the build instead of being swallowed
- `@rockpack/compiler`: the Babel plugins `sourceCompile` resolves at runtime are regular dependencies
- `@rockpack/tester`: `watch` is always a boolean
- `@rockpack/starter`: the SSR template stops loading when the request fails
- `@rockpack/starter`: `-h`/`--help` and `-v`/`--version` print the Rockpack usage and version instead of the yargs defaults
- Generated libraries and components publish only their built files, and the component `types` path points at the emitted declarations
- `@rockpack/compiler` emits no declarations for specs and fixtures
- `@rockpack/compiler`: the `vendor` option moves the listed modules into `vendor.js` only (the main entry now `dependOn`s it); before, they were bundled into both files
- `@rockpack/compiler`: `isomorphicCompiler` fails with `INVALID_CONFIG` when the frontend and the backend write to the same file (one bundle silently overwrote the other)
- `@rockpack/compiler`: `sourceCompiler`/`libraryCompiler` skip an `esm` or `cjs` format that lacks `src` or `dist`; before, such a format was built with empty paths and the output cleanup deleted the project folder
- `@rockpack/compiler` keeps no state on `global` (`ISOMORPHIC`, `CONFIG_ONLY`, `LIVE_RELOAD_PORT`, `LIVE_RELOAD_SERVER` are gone)
- Generated ssr, component and library projects without tests no longer reference `jest` types they do not install
- Generated csr and ssr projects pass `value` to `UnheadProvider` (the `head` prop is deprecated)
- Generated ssr projects listen on `PORT` from `.env` (the template shipped `PORT=8888` but always listened on `4000`)
- `@rockpack/codestyle`: `require()` failed with `ERR_PACKAGE_PATH_NOT_EXPORTED` because the CommonJS build required the ESM-only `@eslint-react/eslint-plugin`
- Generated projects: git hooks work with npm 9+ (husky's removed `set-script`/`add` commands are gone)
- `sourceCompiler` in `@rockpack/compiler` no longer compiles or copies test files into the output: `*.spec.*`, `*.test.*` and anything under `__fixtures__`, `__mocks__` or `__tests__` is skipped

### Deprecated
- `libraryCompiler('MyLib', ...)`: pass `{ name: 'MyLib' }` (the `LibraryCompilerOptions` type is exported). The string form keeps working until 10.0
- `isomorphicCompiler(frontendCompiler(...), backendCompiler(...))`: pass the confs instead, `isomorphicCompiler({ frontend: {...}, backend: {...} })`, moving each compiler's callback to `frontendCallback`/`backendCallback`. The old form keeps working until 10.0

### Removed
- Generated projects have no `analyzer` script
- The SSR template no longer ships a `rockpack.babel.js` (custom Babel config through `rockpack.babel.js` is still supported by `@rockpack/babel`)
- The SSR template no longer depends on the unused `react-router-dom`
- Dropped `jest.extend` from tester
- Removed CommonJS-only build artifacts
- Removed hardcoded `ignores` array from `@rockpack/codestyle` in favor of `.eslintflatignore`

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
