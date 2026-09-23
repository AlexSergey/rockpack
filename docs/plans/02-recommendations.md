# Plan 2: Implement the audit recommendations

Status: proposed
Order: second, after Plan 1 (the unit tests are the safety net for the behavioural changes below)
Owner: TBD

## 1. Goal

Close every finding from the 2026-09-23 audit of the repository: infrastructure (CI, hooks, publishing, root scripts), dependency hygiene, Node/engine alignment, known bugs, error handling, lint rules, duplicated code, and the test-suite issues in `e2e/*`, `examples/*` and the starter templates.

Each item states the files involved, the change, and the acceptance check. Items are grouped by area; the order inside each group is the suggested execution order. Every user-facing change gets a CHANGELOG entry under `9.0.0`.

## 2. Ground rules

- Behavioural changes to a package are made only when that package's unit tests from Plan 1 exist and pass before and after the change. Update or add the tests in the same commit.
- One area per pull request; one commit per numbered item where practical.
- No new abstractions for one-off fixes. Reuse `@rockpack/utils` for anything shared by two or more packages.
- Prefer `type` over `interface`, no `any`, minimal diffs, no unrelated reformatting.

## 3. Area A: CI and git hooks

- [ ] **A1. CI workflow.** Add `.github/workflows/ci.yml` triggered on `push` to `next` and `master` and on `pull_request`.
  Jobs:
  1. `check` (ubuntu-latest, `actions/setup-node` with `node-version-file: .nvmrc`, `cache: npm`): `npm ci`, `npm run build`, `npm run lint`, `npm run test:unit`, upload `packages/*/coverage/lcov.info` as artifacts.
  2. `e2e-light` (needs `check`): `npm test -w e2e/babel-e2e`, `npm test -w e2e/compiler-e2e`, `lerna run test --scope='@rockpack/example-tester-*'`.
  3. `examples-build` (needs `check`): `lerna run build --scope='@rockpack/example-compiler-*'` (compiler examples currently have no automated check at all).
  4. `starter-e2e` (needs `check`, `workflow_dispatch` and nightly `schedule` only until item A6 makes it deterministic): installs Chromium through `npx puppeteer browsers install chrome`, runs `npm test -w e2e/starter-e2e`.
  Acceptance: green run on `next`; a PR that breaks lint or a threshold fails.
- [ ] **A2. Pages workflow.** `.github/workflows/pages.yml` currently deploys the committed `docs/` build on push to `master`. Keep the trigger but add `paths: ['docs/**']` so plan documents and unrelated commits do not redeploy. Building `book` in CI is deferred to Plan 3 because `book/scripts.build.ts` prerenders with a local `/Applications/Chromium.app` in non-headless mode.
- [ ] **A3. Install hooks on clone.** Root `package.json`: add `"prepare": "simple-git-hooks"`. Acceptance: fresh clone plus `npm i` produces `.git/hooks/pre-commit`.
- [ ] **A4. Lighter hooks.** Add `lint-staged` (devDependency, root) with `"*.{ts,tsx,js,mjs,cjs}": "eslint --fix"` and `"package.json": "eslint --fix"`. `simple-git-hooks.pre-commit` becomes `npx lint-staged`; `pre-push` becomes `npm run lint && npm run test:unit`. The full `npm test` (e2e and examples) runs in CI only. Acceptance: committing a single file takes seconds, not minutes.
- [ ] **A5. Dependency update automation.** Add `renovate.json` (or `.github/dependabot.yml`) with grouped weekly PRs for `@babel/*`, `@typescript-eslint/*`, `eslint*`, `jest*`, `webpack*`, and `rangeStrategy: pin`. The in-repo `updater.ts` stays for bulk local runs. Acceptance: first bot PR opened and CI runs on it.
- [ ] **A6. Make `e2e/starter-e2e` deterministic** (`e2e/starter-e2e/src/generators.spec.ts`, `simple-flow.spec.ts`, `utils/*`):
  - replace the three hardcoded `executablePath: '/opt/homebrew/bin/chromium'` with `process.env.PUPPETEER_EXECUTABLE_PATH ?? undefined` so puppeteer's bundled browser is used by default;
  - clear `screenshots/new/` in `beforeAll`, rethrow screenshot errors instead of `console.error`, assert the file exists before `looksSame`;
  - replace `{ strict: true }` pixel comparison with a tolerance (`tolerance: 5, ignoreAntialiasing: true`) or, better, assert DOM content through page selectors and keep a single smoke screenshot;
  - kill the whole process group (`spawn` with `detached: true` then `process.kill(-pid)`), and pick free ports through `find-free-port` instead of fixed 3000/4000/35729;
  - fix the `tsx ./src/csr.server.js` spawn (the file is `.ts`) and pass an explicit `cwd`;
  - move project generation into `beforeAll` so individual `it` blocks can run alone; replace the repeated ANSI-strip/`execSync`/`exists` blocks with one helper in `src/utils/run.ts`;
  - fix the `generates project with type %i` title (use `it.each` with `%s`), remove `any` casts in catches;
  - `simple-flow.spec.ts` "no name" test must use `expect(() => execSync(...)).toThrow(/Please specify/)`;
  - `--mode=test` must not hit the network: see B6 (starter resolves versions offline in test mode).
  Acceptance: the suite passes twice in a row on macOS and in the CI job from A1 without network after install.

## 4. Area B: root scripts, publishing, versions

- [ ] **B1. Declare root script dependencies.** Root `package.json`: add `tsx`, `semver`, `latest-version`, `yargs`, `@types/semver`, `@types/yargs` to `devDependencies` (versions aligned with the packages); move `sort-package-json` to `devDependencies`; remove `@inquirer/select` (unused at root). Acceptance: `npm run updater -- --dry-run`, `npm run version:set -- 9.0.0-next.0` and `npm run cloc` run on a clean install.
- [ ] **B2. Derive workspace lists from `workspaces`.** Add `tools/workspaces.ts` exporting `getWorkspacePackageJsons(): string[]` (uses `fs.globSync` over the root `workspaces` globs, Node 22+). Use it in `updater.ts` and `version.ts` and delete both hardcoded lists. This removes the `examples/compiler/source-js` phantom path in `version.ts` and includes `book`, `packages/tsconfig` and the root in the updater. Acceptance: both scripts touch exactly the set of `package.json` files that `npm query .workspace` reports.
- [ ] **B3. Make `version.ts` atomic.** Read and validate every file first, then write all of them; a failure before the write phase leaves the tree untouched. Also validate the version with `semver.valid` instead of the manual split. Acceptance: pointing the script at a missing file changes nothing.
- [ ] **B4. `updater.ts` options.** Add `--dry-run` (print the plan, write nothing), `--no-major` (skip major bumps and list them at the end), and a concurrency limit of 8 for the registry calls (`latest-version` and the peer metadata fetch). Keep the peer-conflict resolution added on 2026-09-23. Acceptance: `--dry-run` output lists the skipped majors; runtime under one minute.
- [ ] **B5. Resolve the versioning model.** `lerna.json` says `"version": "independent"` while `version.ts` forces one version on every workspace. Decide for fixed mode: set `"version": "8.0.0"` in `lerna.json` (fixed mode) and keep `version:set` as the single tool, or drop `version.ts` in favour of `lerna version --no-push --no-git-tag-version`. Recommended: fixed mode plus `version.ts` (already handles the `@rockpack/*` cross-references). Acceptance: `lerna.json` and the script agree, documented in README "Release".
- [ ] **B6. Publishing safety.** Every publishable package (`babel`, `codestyle`, `compiler`, `starter`, `tester`, `tsconfig`, `utils`): add `"prepublishOnly": "npm run build"` (tsconfig: none needed), add `lint` to the `production` script of `starter` and `tsconfig`, and remove `index.webview.ejs` from `packages/compiler/package.json` `files` (the file does not exist). Root `production` stays `lerna run production`. Acceptance: `npm pack --dry-run -w packages/<name>` lists only `lib`, `types`, README and LICENSE.

## 5. Area C: dependency hygiene

Every removal below was found by grepping `src` for imports. Before removing, confirm again with `npx knip` (C6) and a full `npm run build && npm run lint && npm run test:unit`.

- [ ] **C1. `@rockpack/compiler`.** Remove `colors`, `async`, `cross-env`, `moment` (replace the duration format in `src/utils/log.ts` with plain arithmetic that keeps hours), `@rockpack/codestyle` (pulls all of ESLint and Stylelint into every consumer). Verify and then remove the unreferenced loaders `arraybuffer-loader`, `imports-loader`, `null-loader`, `script-loader`, `svg-inline-loader`. Keep `eslint` as devDependency only.
- [ ] **C2. `@rockpack/babel`.** Remove `@babel/generator`, `@babel/parser`, `@babel/traverse`, `update-browserslist-db`, `valid-types`, `@rockpack/tsconfig`; move `babel-plugin-add-import-extension` to `devDependencies` (build-only); make `react-compiler-runtime` a `peerDependency` (optional) instead of a dependency, documented in the babel README.
- [ ] **C3. `@rockpack/tester`.** Remove `@adobe/css-tools`, `isomorphic-fetch`, `pretty-format`, `source-map`, `valid-types`, `yargs`, `yargs-unparser`. Keep `@types/jest` in `dependencies` on purpose (consumers write specs against jest globals) and add a comment in the README explaining why.
- [ ] **C4. `@rockpack/codestyle`.** Remove `@rockpack/babel`, `yargs`, `deep-extend`. Decide for each of `eslint-plugin-json`, `stylelint*`, `@commitlint/*`: either export a real config for it from `src` (see Plan 3, codestyle section) or remove it and the README claim. Until then, they stay.
- [ ] **C5. `@rockpack/utils` and `@rockpack/starter`.** utils: remove `valid-types`. starter: remove `ncp` (replaced by `src/utils/copy.ts`); pick one prompt library (`@inquirer/select` plus `@inquirer/confirm`, dropping `inquirer`), covered by the wizard tests.
- [ ] **C6. Automate.** Add `knip` at the root with a `knip.json` covering `packages/*` and `e2e/*`, and run `npx knip` in the CI `check` job. Add `syncpack` (`syncpack lint` in CI) to keep the same dependency at the same version across workspaces; fix the current mismatches: `@inquirer/select` (root 5.0.4 vs starter 5.2.0), `sort-package-json` (3.6.0 vs 3.6.1), `cross-env` (7.0.3 vs 10.1.0).
- [ ] **C7. Hoist shared dev tooling.** Move `tsx`, `typescript`, `@types/node`, `cross-env` to root `devDependencies` and delete them from the workspaces that only use them for scripts (keep `typescript` as a dependency where it is imported at runtime: compiler, tester). Acceptance: `syncpack lint` clean, `npm ls typescript` shows one version.

## 6. Area D: Node and engines

- [ ] **D1. One Node baseline.** Set `engines.node` to `>=24` in root and every package (Node 23 is end-of-life; `@babel/core@8`, which the updater will propose, requires `^22.18 || >=24.11`). Update `packages/starter/src/bin/index.ts` `minVer` to 24, README "Requirements", and the starter README. Add `engine-strict=true` to `.npmrc`.
- [ ] **D2. One `@types/node`.** Pin `@types/node@24.x` at the root only (C7) and remove the `26.x` copies from babel, compiler and utils.
- [ ] **D3. `@rockpack/tsconfig` variants.** Add `tsconfig.node.json` (no `dom` lib, `types: ["node"]`) and switch utils, starter, tester and compiler core to it; remove the stray `outDir: ./dist` and `strictPropertyInitialization: false` from the base config after confirming no package relies on it. Export both files from the package (`exports` map).

## 7. Area E: known bugs

- [ ] **E1. Starter update check** (`packages/starter/src/bin/rockpack.ts`): compare with `semver.gt(latest, current)`; fix the inverted message ("A newer Rockpack version is available"); wrap `latestVersion` in `try/catch` so the CLI works offline; skip the check entirely in `--mode=test`.
- [ ] **E2. Starter git hooks** (`packages/starter/src/utils/git-hooks.ts`, roadmap item "Fix husky initialization"): `npm set-script` (removed in npm 9) and `husky add` (removed in husky 9) no longer exist. Replace with writing `.husky/pre-commit`, `.husky/pre-push`, `.husky/commit-msg` files directly plus `"prepare": "husky"` in the generated `package.json`, or switch generated projects to `simple-git-hooks` (smaller, no shell files). Recommended: `simple-git-hooks`, mirroring the monorepo. Update `versions.json` `git.common` accordingly and the starter-e2e assertions.
- [ ] **E3. Starter `.` handling** (`rockpack.ts`): `return process.exit(1)` and the `readdirSync` on a non-existent path; guard with `existsSync`.
- [ ] **E4. Compiler `mergeConfWithDefault`** (`src/utils/merge-conf-with-default.ts`): in the "dist is a folder" branch `distContext` is set to the file path instead of its directory; align with the other branches.
- [ ] **E5. Compiler `makeBanner`** (`src/modules/make-banner.ts`): `indexOf(type) > 0` misses a placeholder at index 0; use `includes`. Resolve the banner file relative to the package root through `import.meta.url` instead of `../../..`.
- [ ] **E6. Compiler small fixes:** stray `"` in the `SsrDevelopment` plugin name (`plugins/ssr-development/index.ts`); suspicious regex `/\.wasm(\.js)$/` in `modules/make-modules.ts` (should be `/\.wasm$/` or `/\.wasm\.js$/`, decide by the intended loader); `generate-dts.ts` `require.resolve('../constants.mjs')` fails when executed from `src` (use a static import); `sourceCompiler` swallows errors from `sourceCompile` and `generateDts` (log and rethrow so builds fail).
- [ ] **E7. Starter SSR template hook** (`packages/starter/templates/backbone/ssr/src/hooks/rockpack-description.hooks.ts`): the `catch` branch never calls `setLoading(false)` (the csr version does). Add the negative test in both `hooks/*.spec.tsx` templates.
- [ ] **E8. Tester examples `test:watch`**: only `examples/tester/debug/scripts.tests.ts` reads the `watch` argument. Either make `@rockpack/tester` read `--watch` from `process.argv` (recommended, documented in the tester README) or fix the nine scripts. The starter templates use `--watch`, so the tester-side fix makes both conventions work.
- [ ] **E9. Tester README** documents `const tests = require('@rockpack/tester'); tests();` but there is no default export. Fix the README (`import { tester } from '@rockpack/tester'`).
- [ ] **E10. `packages/tester/tsconfig.types.json`** includes a non-existent `src/globals.d.ts`; remove it. `packages/compiler/scripts/build.ts` filters `index.cts` which no longer exists; remove the filter.

## 8. Area F: error handling in `@rockpack/compiler`

Do this after the Plan 1 compiler tests exist; each step keeps the test-suite green.

- [ ] **F1. Typed errors.** Add `src/errors/rockpack-error.ts` with `class RockpackError extends Error { readonly code: 'INVALID_CONFIG' | 'INVALID_ENTRY' | 'BUILD_FAILED' | 'DTS_FAILED' }`. Replace the string constants in `src/errors/*.ts` with factory functions returning `RockpackError`.
- [ ] **F2. Throw, do not exit, in library code.** Remove `process.exit` from `compilers/isomorphic-compiler.ts`, `compilers/library-compiler.ts`, `modules/make-entry.ts`, `utils/find-html.ts`, `utils/common-multi-validators.ts` and `core/run.ts`; throw `RockpackError` or reject instead. Delete the dead `find-html.ts`, `common-multi-validators.ts` and `errors/markup-compiler.ts` (unused).
- [ ] **F3. Exit only at the boundary.** The exported compiler functions (`frontendCompiler`, `backendCompiler`, `libraryCompiler`, `isomorphicCompiler`, `sourceCompiler`) catch `RockpackError`, log it through `utils/log.ts`, set `process.exitCode = 1`, and reject. Production builds still terminate the process at the end of `run` (webpack keeps handles open), but with `process.exitCode` set from the stats instead of `exit(0)` on error.
- [ ] **F4. `error-handler.ts`.** Register the process listeners once (module-level guard), set `process.exitCode = 1` and rethrow in `uncaughtException`/`unhandledRejection`, exit with 130/143 on SIGINT/SIGTERM, delete the empty `try {}`.
- [ ] **F5. Document** the new behaviour in the compiler README (scripts can `await frontendCompiler(...)` and catch `RockpackError`).

## 9. Area G: lint rules and type style

- [ ] **G1. `type` over `interface`** (`packages/codestyle/src/index.ts`): add `'@typescript-eslint/consistent-type-definitions': ['error', 'type']`, drop the interface naming-convention entry, remove the removed `@typescript-eslint/ban-types` and deprecated `no-empty-interface` rules. Run `npm run format` across the repo (about 45 interfaces convert) and review the diff for `declare module` blocks that must stay as interfaces (module augmentation).
- [ ] **G2. Test-file override** in codestyle (done partially in Plan 1, Phase 0.4): jest globals for `*.spec.{ts,tsx}`, `eslint-plugin-jest` recommended rules (`no-disabled-tests`, `no-focused-tests`, `valid-expect`, `prefer-to-have-length`), keep `no-only-tests`.
- [ ] **G3. Import extension convention.** Pick `.js` for relative imports inside `packages/*/src` (NodeNext-compatible, already used by compiler and tester) and enforce it with `import-lite/extensions` or `@typescript-eslint` `consistent-type-imports` plus a `no-restricted-syntax` pattern for `.ts` extensions. Fix `packages/starter/src/lib/install.ts` (`.ts` imports) and the extension-less imports across starter. Also decide on `allowImportingTsExtensions` in the shared tsconfig (it currently allows the inconsistency).
- [ ] **G4. Unsafe casts.** `compiler/src/modules/make-plugins.ts` (`page as any`, `patterns: _prop as any`, the `Dotenv` private-field delete through `as unknown as`), `make-optimization.ts` (`as any`), `core/compile.ts` and `plugins/ssr-development/index.ts` (`as unknown as`), `codestyle/src/index.ts` (`tseslintPlugin as unknown as ESLint.Plugin`). Type `HtmlPage` and `CopySpec` against `HtmlWebpackPlugin.Options` and `CopyWebpackPlugin`'s pattern type; drop the Dotenv hack by passing `systemvars: false`/`expand` options instead of deleting a private field, or by upgrading `dotenv-webpack`. Acceptance: `grep -rn "as any\|as unknown as" packages/*/src` returns nothing except documented exceptions.

## 10. Area H: duplicated and dead code

- [ ] **H1. `readPackageJson(dir)`** in `@rockpack/utils` (returns `PackageJson | undefined`, swallows ENOENT and JSON errors). Use it in `babel/src/index.ts`, `codestyle/src/index.ts`, `compiler/src/core/make.ts`; delete the three local `PackageJson` interfaces in favour of one exported `type PackageJson` from utils.
- [ ] **H2. `getMode`/`setMode`.** Implement `setMode` as `getMode` plus the two env writes; parse argv lazily inside the function (this also removes the import-time side effect that Plan 1 works around). Delete `compiler/src/utils/other.ts#getMajorVersion` (utils has the canonical one).
- [ ] **H3. Shared build script.** Create a private workspace `tools/build` (not published) exporting `buildPackage({ formats: ['esm','cjs'], copyDirs, importMeta })` used by `packages/{babel,utils,tester,compiler}/scripts/build*.ts` and a single `clean` implementation. The four `scripts/clean.ts` copies and the two near-identical build scripts per package collapse to one-line callers. Keep `sourceCompiler` for codestyle and starter (they already use it). The compiler cannot build itself with `sourceCompiler`, which is why the tool lives outside the packages.
- [ ] **H4. Complexity hot-spots.** Split `compiler/src/modules/make-plugins.ts` (`getPlugins`, about 220 LOC, sonar disabled) into `plugins/html.ts`, `plugins/env.ts`, `plugins/banner.ts`, `plugins/copy.ts`, `plugins/development.ts`, `plugins/production.ts`, `plugins/analyzer.ts`, each returning `Collection` entries; the same for `codestyle/src/index.ts` (316 LOC, sonar disabled) into `rules/typescript.ts`, `rules/react.ts`, `rules/style.ts`, `rules/files.ts`, `rules/tests.ts`. Remove the `@sonar/cognitive-complexity` disables afterwards. Unit tests from Plan 1 cover both before the split.
- [ ] **H5. Dependency cycles and build order.** Remove `@rockpack/codestyle` from the devDependencies of babel, utils and tester by linting them from a root `eslint.config.ts` that imports `packages/codestyle/src` (the root already resolves it through the workspace). Declare `@rockpack/compiler` as a devDependency where a build script imports it (done on 2026-09-23 for codestyle and starter). Then replace the hand-ordered root `build` chain with `lerna run build` (topological) and keep the per-package `build:*` scripts for local use. Acceptance: `lerna run build` prints no cycle warning.

## 11. Area I: test-suite recommendations outside `packages/*`

- [ ] **I1. `describe` structure** (CLAUDE.md): rewrite these specs into `negative cases` / `positive cases` blocks: `examples/tester/{debug,simple,typescript}/src/sum.spec.ts`, `examples/tester/es2015+/src/index.spec.ts`, `examples/tester/sinon/src/user-utils.spec.ts`, `examples/tester/graphql/src/app.spec.tsx`, `examples/tester/rest/src/app.spec.tsx`, `examples/tester/react/src/{link,my-component}.spec.tsx`, `examples/tester/node-jest-environment/src/index.spec.ts`, `examples/tester/node-jest-extend/src/index.spec.ts`, `e2e/babel-e2e/src/main.spec.ts`, `e2e/starter-e2e/src/*.spec.ts`, and the starter templates under `packages/starter/templates/addons/tester/**` (`index.spec.ts(x)`, `hooks/*.spec.tsx`, `api/*.spec.ts`, `components/tags`, `components/feature-card`). Templates csr and ssr `components/` are byte-identical: keep them identical or share them (Plan 3).
- [ ] **I2. Determinism in examples and templates:** `examples/tester/es2015+/src/index.spec.ts` (real 1000 ms wait) and the template `api/rockpack.api.spec.ts` (real 600 ms) use `jest.useFakeTimers()`; `examples/tester/react/src/link.spec.tsx` snapshots `asFragment()` instead of the whole RTL render result; remove the `debugger` in `examples/tester/debug/src/sum.spec.ts`; sinon example stubs in `beforeEach` with `restore` in `afterEach`.
- [ ] **I3. `e2e/babel-e2e`.** After Plan 1 Phase 2 it duplicates `packages/babel/src/index.spec.ts`. Keep it as a five-line smoke test of the built `lib` (import from `@rockpack/babel`, assert one preset) and delete the rest, or delete the workspace. Also drop the copied `modulePathIgnorePatterns: ['./src/generators/']` in its `scripts.test.ts`.
- [ ] **I4. Tester defaults for consumers** (`packages/tester/src/configs/config-compiler.ts`): make `maxWorkers: 1`, `runInBand` and `noCache` opt-in (`TesterOptions.serial?: boolean`, default `false`), keep `--watch` fast. Add `collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!**/*.spec.*', '!**/*.test.*']` as the default so coverage counts untested files. Add `text-summary` and `lcov` reporters (done in Plan 1 Phase 0.2 if not already).
- [ ] **I5. Repository hygiene.** Delete the stray per-example `package-lock.json` files (`examples/compiler/{css-modules,imagemin,react-app,ts-css-modules}`, `examples/tester/{graphql,react,rest,sinon,typescript}`), add `**/package-lock.json` except the root one to `.gitignore`, add `.DS_Store` cleanup, and remove the empty `NO_COMMIT/` directory or document it in `.gitignore`.

## 12. Area J: documentation

- [ ] **J1.** README "Contributing": Node 24, `npm i`, `npm run build`, `npm run lint`, `npm run test:unit`, `npm test`; the release flow (B5, B6); how the updater works (`--dry-run`, `--no-major`, peer resolution).
- [ ] **J2.** Starter README: document `--type`, `--tests`, `--no-install`, `--mode=test`, `--folder`, `--yarn`.
- [ ] **J3.** Tester README: correct import, `--watch`, `serial` option, coverage configuration and thresholds, `moduleNameMapper` for `.js` imports.
- [ ] **J4.** CHANGELOG `9.0.0`: one bullet per behavioural change in this plan (F, I4, C2 peer dependency, D1 engines, E2 hooks).
- [ ] **J5.** `roadmap.md`: mark "Fix husky initialization" done (E2), add the Plan 3 items as pending.

## 13. Acceptance for the whole plan

1. CI runs on every PR and on `next`; `starter-e2e` runs nightly and passes.
2. `npx knip` and `syncpack lint` are clean; `npm ls` shows one version per shared dependency.
3. `grep -rn "process.exit" packages/compiler/src` matches only `error-handler.ts` and the exported compiler entry points.
4. `grep -rn "interface " packages/*/src` matches only module augmentation blocks.
5. Every spec in the repository follows the negative/positive structure.
6. All Plan 1 thresholds still hold.

## 14. Suggested order

| Step | Items | Size |
|---|---|---|
| 1 | A1, A3, A4 (CI and hooks first, so everything after is checked automatically) | M |
| 2 | B1, B2, B3, B4, B5, B6 | M |
| 3 | C1 to C7, D1 to D3 | M |
| 4 | E1 to E10 | M |
| 5 | G1 to G4, H1, H2 | M |
| 6 | F1 to F5 | L |
| 7 | H3, H4, H5 | L |
| 8 | I1 to I5, A6, J1 to J5 | M |
