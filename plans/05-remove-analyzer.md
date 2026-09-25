# Plan 5: Remove the built-in bundle analyzer

Status: approved 2026-09-25 (D1 and D2 as recommended)
Order: after Plan 3; part of the `9.0.0` breaking changes
Owner: TBD

## 1. Goal

`@rockpack/compiler` stops shipping bundle analysis. The `analyzer` option, the `--analyzer` command-line flag, `webpack-bundle-analyzer` and `@statoscope/webpack-plugin` are removed. A project that wants a bundle report adds the plugin itself through the compiler callback (`plugins.set(...)`), which is already the documented way to add any webpack plugin.

Why:

- Two heavy dependencies (Statoscope alone brings 14 `@statoscope/*` packages, including a UI bundle) are installed by every Rockpack user, while only a few use them.
- The analyzer is the only reason for special cases in the compiler: the `--analyzer` flag handling (`core/args.ts`, the isomorphic backend exception), a free-port lookup for port 8888, a CommonJS interop workaround for Statoscope (`exports.default`, found when the build scripts moved to `node` in Plan 3 C17), and declarations for two untyped packages.
- The choice of tool (webpack-bundle-analyzer, Statoscope, RsDoctor, `webpack --json` + an online viewer) is a project decision; the callback already gives full control.

## 2. Non-goals

- No replacement analyzer and no new option (for example `plugins: [...]`): the callback is the API.
- No change to the callback, `Collection` or the order of the remaining plugins.
- `getArgs()` (the public way to read command-line flags) stays; only the compiler's own use of `--analyzer` goes.

## 3. Inventory

Everything that mentions the analyzer today (checked with `grep -rniI "analyzer\|statoscope"` outside `node_modules`, build output and the lockfile).

### `@rockpack/compiler`

| Place | What it does | Action |
|---|---|---|
| `src/modules/plugins/analyzer.ts` | `makeAnalyzerPlugins`: `BundleAnalyzerPlugin` (server on a free port from 8888 in development, static `webpack-report.html` in production) and `StatoscopeWebpackPlugin` (loaded through `createRequire`) | Delete |
| `src/modules/make-plugins.ts` | Spreads `makeAnalyzerPlugins(ctx)` last | Remove the call and the import |
| `src/core/args.ts` | `addArgs`: `--analyzer` sets `conf.analyzer` (false for the isomorphic backend); the file does nothing else | Delete |
| `src/core/compile.ts` | `merged = addArgs(merged, ctx)` | Remove the step and the import |
| `src/types.ts` | `analyzer?: boolean` in `CompilerConf` | Remove |
| `src/utils/validate-conf.ts` | `analyzer: optional(boolean)` | Replace with a removed-option error (A3) |
| `src/declarations.d.ts` | Module declarations for `webpack-bundle-analyzer` and `@statoscope/webpack-plugin` | Remove both |
| `package.json` | `@statoscope/webpack-plugin` 5.29.0, `webpack-bundle-analyzer` 5.3.0 | Uninstall; lockfile loses about 20 packages |
| Specs | `make-plugins.spec.ts` (mocks, "skips the analyzer", the full plugin order, development port, production report), `args.spec.ts` (whole file), `validate-conf.spec.ts` (`analyzer: 'yes'` and a valid `analyzer: true`), `argv.spec.ts` (uses `--analyzer` only as a sample flag) | Remove or rewrite; `argv.spec.ts` switches to a neutral flag |
| `README.md` | Feature list line "Bundle Analyze (webpack-bundle-analyzer, Statoscope)"; "How a build is assembled" mentions `--analyzer` | Remove; add the callback recipe (A5) |

Kept on purpose: `find-free-port` (the dev server still uses it), `getArgv` and `yargs` (dev server `--_rockpack_testing`, public `getArgs`).

### `@rockpack/starter`

| Place | What it does | Action |
|---|---|---|
| `src/lib/package-json-preparing.ts` | Adds an `analyzer` script (`... scripts.build.ts --analyzer`) to csr, ssr, component and library projects | Remove the script |
| `src/lib/package-json-preparing.spec.ts` | Expects the script | Update |
| `README.md` | "Bundle Analyzer, Statoscope" in the feature list | Remove |
| `e2e/starter-e2e/golden/*.package.json` (8 files) | Contain the `analyzer` script | Regenerate |

### Examples, e2e, docs

| Place | What it does | Action |
|---|---|---|
| `examples/compiler/analyzer` | `analyzer: true`, scripts `analyzer` / `analyzer:prod` with `--analyzer` | Turn into the "bring your own analyzer" example (A6) or delete (decision D2) |
| `e2e/compiler-e2e/fixtures/frontend-analyzer` + `frontend.spec.ts` "emits the static bundle report" | Checks `dist/webpack-report.html` | Delete, or turn into a callback-plugin check (decision D2) |
| `e2e/compiler-e2e` examples corpus golden | Lists the analyzer example output | Regenerate with the example change |
| `e2e/packaging-e2e/golden/compiler.txt` | Lists `analyzer.{cjs,mjs,d.ts}` | Regenerate |
| Root `README.md` | Two feature-list lines about Bundle Analyzer / Statoscope | Remove |
| `CHANGELOG.md` | Entry about the Statoscope ESM fix (Plan 3 C17) | Keep in history, add the removal as **Breaking** |
| `MIGRATION.md` | - | New section with the recipe (A7) |
| `packages/utils/src/utils/get-mode.spec.ts` | Uses `--analyzer` as a sample unrelated flag | Optional: rename the sample flag, not required |
| `plans/03-code-improvements.md` C13 | Mentions the analyzer port lookup | Leave (history) |

## 4. Decisions to confirm

- **D1. What `analyzer: true` does after the removal.** Validation ignores unknown options, so a JavaScript project would silently lose its report (TypeScript projects get a type error). Recommended: keep a removed-option check until `10.0` that fails with `INVALID_CONFIG: analyzer was removed in 9.0.0, add the analyzer plugin in the compiler callback (see MIGRATION.md)`. Alternative: ignore it silently. The `--analyzer` flag is ignored silently either way (yargs accepts any flag); the generated `analyzer` script is removed, so new projects do not pass it.
- **D2. The example and the e2e fixture.** Recommended: keep `examples/compiler/analyzer` as the documented recipe (its own `webpack-bundle-analyzer` devDependency, the plugin added with `plugins.set` in the callback, static report in production) so the examples e2e proves the recipe works; delete the `frontend-analyzer` fixture, because the callback is already covered by the elm example and the unit specs. Alternative: delete both.

## 5. Steps

Each item is one commit with the usual checks (package lint, `tsc --noEmit`, unit tests with thresholds, type-coverage, `lint:deps`), goldens regenerated in the same commit.

- [x] **A1. Compiler code.** Delete `plugins/analyzer.ts` and `core/args.ts`; remove their calls from `make-plugins.ts` and `compile.ts`; remove `analyzer` from `CompilerConf` and the two module declarations. Update `make-plugins.spec.ts` (mocks, the full plugin order without the two analyzer plugins, drop the three analyzer cases), delete `args.spec.ts`, switch `argv.spec.ts` to a neutral flag. Coverage thresholds (compiler 96/92/98/96) must still hold. _Done 2026-09-25: both modules and `args.spec.ts` deleted, `compile` goes straight from the inner props to `make`, the plugin order spec lost the two analyzer plugins, `argv.spec.ts` uses `--verbose`._
- [x] **A2. Dependencies.** `npm uninstall @statoscope/webpack-plugin webpack-bundle-analyzer -w packages/compiler`; check with `npm ls` that nothing else in the monorepo depends on them (the analyzer example gets its own `webpack-bundle-analyzer` in A6 if D2 keeps it); `lint:deps` clean; packaging golden regenerated. _Done 2026-09-25: 50 packages left the lockfile; nothing else depended on them; `lint:deps` clean; the compiler tarball lost `analyzer` and `args` files._
- [x] **A3. Validation (per D1).** Replace `analyzer: optional(boolean)` with a check that reports any defined `analyzer` value as removed, with the migration hint; unit case in `validate-conf.spec.ts` (negative: `analyzer: true` fails with the message; positive: a conf without it passes). Mark the check for removal in `10.0` in the code comment. _Done 2026-09-25: a `removed(hint)` check reports any `analyzer` value as `INVALID_CONFIG: analyzer was removed in 9.0.0: add the analyzer plugin in the compiler callback (see MIGRATION.md)`; marked for removal in 10.0._
- [x] **A4. Starter.** Remove the `analyzer` script from the four project types, update the spec and the starter README, regenerate the generation goldens. _Done 2026-09-25._
- [x] **A5. Compiler README.** Remove the feature line and the `--analyzer` mention; add a Q&A entry "How do I analyze the bundle?" with the callback recipe:

  ```ts
  import { frontendCompiler } from '@rockpack/compiler';
  import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

  void frontendCompiler({}, (config, modules, plugins, mode) => {
    plugins.set(
      'BundleAnalyzerPlugin',
      new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false, reportFilename: 'webpack-report.html' }),
    );
  });
  ```

  and a note that the same works for Statoscope (`@statoscope/webpack-plugin`, default export) or any other plugin, with `mode` to enable it only in production.
- [x] **A6. Example and e2e (per D2).** Rewrite `examples/compiler/analyzer/scripts.build.ts` to the recipe, give the example its own `webpack-bundle-analyzer` devDependency (same version as removed from the compiler, syncpack-aligned), drop the `--analyzer` scripts; delete the `frontend-analyzer` fixture and its spec case; regenerate the examples golden. _Done 2026-09-25: the example adds `BundleAnalyzerPlugin` in production through `plugins.set`, with its own `webpack-bundle-analyzer` 5.3.0 and `@types/webpack-bundle-analyzer` 4.7.0 (its build type-checks the script, so a user needs the types too; the README says so); its examples golden is unchanged, the report is still emitted. The `frontend-analyzer` fixture and its case are gone._
- [ ] **A7. Root README, CHANGELOG, MIGRATION.** Remove the two root README lines; CHANGELOG **Breaking** entry ("`@rockpack/compiler` no longer ships a bundle analyzer: the `analyzer` option, the `--analyzer` flag, `webpack-bundle-analyzer` and `@statoscope/webpack-plugin` are removed; add the plugin in the callback") and a "Removed" line for the starter's `analyzer` script; MIGRATION section under `@rockpack/compiler` with the before/after code from A5.
- [ ] **A8. Full verification and CI.** `npx nx reset`, then build, lint, test:unit, type-coverage, lint:deps, e2e, e2e:runtime and the tester examples; every exit code read before the push; wait for CI.

## 6. Risks

- **Users who relied on `--analyzer` in scripts** get no report and no error from the flag. Mitigated by the MIGRATION entry and, for `analyzer: true`, by D1.
- **Callback ordering.** `plugins.set` appends to the end of the collection, which is where the analyzer plugins were, so the recipe reproduces the old plugin order.
- **Isomorphic builds.** The old flag skipped the backend; with the recipe the user adds the plugin only in `frontendCallback`. The README recipe says so.

## 7. Acceptance

1. `grep -rniI "analyzer\|statoscope" packages/*/src` finds nothing except the removed-option check (A3) and its spec.
2. `npm ls webpack-bundle-analyzer @statoscope/webpack-plugin` shows them only under the analyzer example (or nowhere if D2 deletes it); the compiler tarball file list has no `analyzer` files.
3. A generated project has no `analyzer` script; the starter goldens and README agree.
4. The compiler README documents the callback recipe, and (with D2 as recommended) the analyzer example builds its report with it in the examples e2e.
5. CHANGELOG and MIGRATION describe the removal; all checks and CI are green.

## 8. Order and size

| Step | Items | Size |
|---|---|---|
| 1 | Confirm D1, D2 | - |
| 2 | A1, A2, A3 (compiler) | S |
| 3 | A4 (starter) | S |
| 4 | A5, A6, A7 (docs, example, e2e) | S |
| 5 | A8 | S |
