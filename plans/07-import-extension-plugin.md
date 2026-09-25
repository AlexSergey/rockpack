# Plan 7: Own import extension plugin in @rockpack/babel

Status: approved 2026-09-25 (D1 to D3 as recommended)
Order: independent; prepares the Babel 8 migration (issue #71), which gets its own plan
Owner: TBD

## 1. Goal

Replace `babel-plugin-add-import-extension` with a small plugin shipped by `@rockpack/babel` (`@rockpack/babel/plugins/import-extension`) that covers every case the per-file builds need, fixes the defects found below and runs on Babel 7 and Babel 8.

Why:

- `babel-plugin-add-import-extension` 1.6.0 has not been released since April 2022 and calls `api.assertVersion(7)`, so it throws on Babel 8 (issue #71: the major-update canary fails in the package build).
- No maintained drop-in exists: `babel-plugin-fully-specified` (January 2026) also asserts Babel 7 and only adds missing extensions; `babel-plugin-replace-import-extension` (2025) only replaces extensions. The per-file builds need both.
- Dropping the step is not possible: the compiler's per-file builds turn user sources with extensionless imports (`import { sum } from './sum'`) into `.mjs`/`.cjs` files that Node can only load with full specifiers. (Our own packages import with `.js` already and could avoid the rewrite with `.js` output plus per-folder `package.json` type markers, but that changes every package layout and still leaves the users' case.)

## 2. Non-goals

- The Babel 8 migration itself (presets, options, `rockpack.babel.*`): a separate plan. This plan only makes the extension step version-independent.
- CommonJS `require('./x')` calls written by hand, `import.meta.resolve`, TypeScript `import x = require()`: not handled today, not needed by the builds (see 3.3).
- Bare specifiers, `package.json` `imports` (`#internal`), URLs: never touched.

## 3. What the current plugin does

Source: `node_modules/babel-plugin-add-import-extension/src/plugin.js` (90 lines). Used in two places, both with `{ extension: 'mjs' | 'cjs' }` and the default `replace: false`:

- `packages/compiler/src/utils/source-compile.ts` (the users' per-file builds: `sourceCompiler`, `libraryCompiler` `esm`/`cjs`), listed first, before `@babel/plugin-transform-modules-commonjs` for `cjs`.
- `tools/build-tools/src/build-package.ts` (builds our own packages into `lib/esm/*.mjs` and `lib/cjs/*.cjs`).

### 3.1 Behaviour (probed on 2026-09-25 with `extension: 'mjs'`)

| # | Input | Output | Verdict |
|---|---|---|---|
| 1 | `import a from './no-ext'` | `'./no-ext.mjs'` | needed |
| 2 | `import b from './utils'` (folder with `index.ts`) | `'./utils/index.mjs'` | needed |
| 3 | `import c from './both'` (`both.ts` and folder `both/` exist) | `'./both/index.mjs'` | **defect**: Node and TypeScript resolve the file first |
| 4 | `import d from './config.dev'` (`config.dev.ts` exists) | `'./config.dev.mjs'` | needed |
| 5 | `import './styles.css'` | `'./styles.css.mjs'` | **defect**: an asset gets a script extension |
| 6 | `import e from './data.json' with { type: 'json' }` | `'./data.json.mjs'`, the `with` clause is gone | **defect**: extension appended and import attributes lost (the node is rebuilt) |
| 7 | `import f from './x.js'` | `'./x.mjs'` | needed (NodeNext-style `.js` pointing at `x.ts`) |
| 8 | `import g from './y.ts'` | `'./y.mjs'` | needed |
| 9 | `import h from './z.mjs'` | unchanged | needed |
| 10 | `import type { T } from './types'` | unchanged | needed (erased later) |
| 11 | `export * from './all'`, `export * as ns from './ns'`, `export { k } from './k'` | `.mjs` added | needed |
| 12 | `import('./lazy')` | unchanged | **gap**: dynamic imports keep extensionless paths that Node cannot load |
| 13 | `import m from 'react'` | unchanged | needed |
| 14 | `import n from '../up'` | `'../up.mjs'` | needed |

### 3.2 Implementation details worth keeping or dropping

- Relative means "starts with `.`" (covers `./` and `../`). Absolute paths (`/x`) and bare specifiers are skipped; the `require.resolve` check for node modules is dead code for relative paths.
- "Script" extensions: `js`, `ts`, `jsx`, `tsx`, `mjs`, `cjs` (no `mts`/`cts`).
- The folder check (`existsSync(...) && isDirectory()`) runs before any file check, which causes case 3.
- The whole declaration node is replaced with a new one built from `specifiers`/`declaration` and the new string: attributes, `importKind`/`exportKind`, `phase` and the original quotes are lost (case 6; outputs get double quotes).
- Needs the file name (`file.opts.filename`); without it `dirname(undefined)` throws.
- Depends on `@babel/helper-plugin-utils` and requires `@babel/core` itself at load time.

### 3.3 Not handled today and not needed

Hand-written `require('./x')`, `require.resolve`, `import.meta.resolve('./x')`, `import x = require('./x')` (TypeScript, rewritten by the TypeScript preset into `require`). None appears in generated projects or in our packages; documented as unsupported.

## 4. Design

`packages/babel/plugins/import-extension.cjs`, a committed CommonJS file like the existing `plugins/rename-cjs-globals.cjs`: it needs no build, so `tools/build-tools` can use it to build `@rockpack/babel` itself. Exported as `@rockpack/babel/plugins/import-extension`.

Options: `{ extension: 'cjs' | 'js' | 'mjs' }` (required; the output extension without the dot).

Rules, for every relative string specifier of an `ImportDeclaration`, `ExportNamedDeclaration` with a source, `ExportAllDeclaration` and dynamic `import('...')` with a string literal (Babel 7 `CallExpression` with an `Import` callee, Babel 8 `ImportExpression`):

1. Skip type-only declarations, specifiers with `?` or `#` suffixes, and anything not starting with `./` or `../` (and `.`/`..` themselves).
2. A script extension (`.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.mts`, `.cts`) is replaced with the target extension (cases 7, 8; 9 unchanged).
3. With the source file name known, resolve like Node and TypeScript, in this order:
   - the specifier is an existing file: keep it (assets: cases 5 and 6);
   - `<specifier>.<script ext>` exists: append the target extension (cases 1, 4, 14, and 3 now picks the file);
   - `<specifier>/index.<script ext>` exists: `<specifier>/index.<target>` (case 2);
   - nothing matches: append the target extension when the specifier has no extension (a file generated later), otherwise keep it.
4. Without a file name (a string transform): only rules 1 and 2, plus appending to a specifier without any extension.
5. Only the string value of the source changes (`node.source.value`), so import attributes, type modifiers and the original quotes stay.
6. File system checks are cached per build (one `Map` per plugin instance) so a large project does not stat the same path repeatedly.

Compatibility: `api.assertVersion('^7.0.0 || ^8.0.0')`; no `@babel/helper-plugin-utils`, no `require('@babel/core')`; plain Node built-ins only.

## 5. Decisions to confirm

- **D1. Unresolvable specifier without an extension** (`import x from './generated'` where nothing exists yet): recommended append the target extension (today's behaviour, fits files generated during the build). Alternative: leave it and let Node fail loudly.
- **D2. Babel 8 check now:** recommended a spec that also runs the plugin through `@babel/core` 8 installed as an npm alias dev dependency of `@rockpack/babel` (`babel-core-8: npm:@babel/core@8.0.6`), so the "works on Babel 8" claim is tested today; removed again by the Babel 8 migration. Alternative: test on Babel 7 only and rely on the migration plan.
- **D3. Dependency cycle:** `@rockpack/babel` is built by `@rockpack/build-tools`, which would now depend on `@rockpack/babel` for the plugin file. Recommended: declare the dependency and exclude it from the nx graph (`"nx": { "implicitDependencies": ["!@rockpack/babel"] }` in build-tools, the pattern babel already uses for codestyle and tester); the plugin file is committed, so no build order is needed. Alternative: build-tools keeps its own copy of the plugin (duplication).

## 6. Steps

Each item is one commit with the package checks (lint, `tsc --noEmit`, unit tests with thresholds, type-coverage, `lint:deps`), goldens in the same commit, full verification before the push.

- [x] **I1. Plugin and unit spec.** `plugins/import-extension.cjs` per section 4, the `./plugins/import-extension` export in `packages/babel/package.json`, and `src/import-extension.spec.ts` that transforms code with `@babel/core` against a temporary project on disk. Negative cases: bare, absolute, `#internal`, URL-like, query/hash, type-only, asset with an extension (css, json with `with { type: 'json' }`, svg), unknown extension that is not a file (kept), non-literal dynamic import. Positive cases: every "needed" row of 3.1, file-before-folder (case 3), `.mts`/`.cts` sources, `export * as ns`, dynamic `import()`, quotes and attributes preserved, the three targets (`mjs`, `cjs`, `js`), no file name (string transform), cache (each path stat once). _Done 2026-09-25: 32 specs against a temporary project on disk; the stat cache is checked with a spy on `fs.statSync`._
- [x] **I2. Babel 8 smoke (per D2).** The same core cases run through the aliased `@babel/core` 8. _Done 2026-09-25: `babel-core-8` (npm alias of `@babel/core` 8.0.6) runs the plugin in a child process (Babel 8 is ESM only); assets with attributes, extensionless, file-over-folder, folder index, re-export and dynamic `import()` (an `ImportExpression` on Babel 8) pass; knip ignores the alias._
- [x] **I3. Compiler per-file builds.** `source-compile.ts` uses `@rockpack/babel/plugins/import-extension`; `babel-plugin-add-import-extension` leaves the compiler dependencies and knip's ignore list. compiler-e2e: a `source-imports` fixture built with `sourceCompiler` covering a folder index, a file next to a same-named folder, a CSS import, a JSON import with attributes and a dynamic import, run by Node from both formats; the existing `source-only` and `library-formats` cases stay green. _Done 2026-09-25: `source-compile` resolves `@rockpack/babel/plugins/import-extension`; the compiler no longer depends on `babel-plugin-add-import-extension`; the `source-imports` fixture runs `json,file,index,lazy` from both formats and keeps `./styles.css`; the unit spec expects the source's single quotes now._
- [x] **I4. Build tools.** `tools/build-tools` uses the same plugin (per D3) and drops `babel-plugin-add-import-extension`. Regression check: build every package before and after and diff `lib/` (only quote style may differ, since the new plugin keeps the source quotes); packaging-e2e goldens and installed ESM/CJS checks stay green. _Done 2026-09-25: build-tools depends on `@rockpack/babel` (excluded from the nx graph, ignored by knip since it is only resolved by path) and no longer on `babel-plugin-add-import-extension`, which is gone from the lockfile; knip's leftover `babel-plugin-*` ignore for the compiler is removed. 51 files of `lib/` differ, all only in quotes and whitespace (the old plugin rebuilt the import nodes, so a following comment was glued onto the import line; it now stays on its own line); no specifier changed. packaging-e2e (goldens, installed ESM/CJS) is green._
- [x] **I5. Docs.** `@rockpack/babel` README section for the plugin (options, rules, unsupported cases); CHANGELOG: Added (the plugin), Fixed (asset imports no longer get a script extension, import attributes kept, a file wins over a same-named folder, dynamic imports rewritten in per-file builds); plan and issue #71 note (the extension part of #71 is solved; Babel 8 itself stays open). _Done 2026-09-25: README section "Import extension plugin", CHANGELOG Added and Fixed entries; the #71 note is posted after the push (I6)._
- [ ] **I6. Full verification and CI.**

## 7. Risks

- **Output differences in our own packages:** quote style in rewritten imports (cosmetic) and any case where the old plugin picked a folder over a file (a real fix). The `lib/` diff in I4 shows every change before the commit.
- **Users relying on the defects:** a CSS or JSON import that ended in `.mjs` could not have worked in Node, so no working output changes; the folder-versus-file fix changes which module is loaded only when both exist, which TypeScript already resolved to the file.
- **Case-insensitive file systems and symlinks:** existence checks follow Node's `fs` semantics like the old plugin; covered by the resolution-order tests on macOS and Linux CI.
- **Babel 8 changes to import nodes** (`ImportExpression`, attributes): handled by visiting both forms; D2 tests them now.

## 8. Acceptance

1. `babel-plugin-add-import-extension` is gone from every `package.json` and the lockfile.
2. Every "needed" case of 3.1 produces the same specifier as before; the three defects and the dynamic import gap are fixed, each with a test.
3. The plugin runs on Babel 7 and (per D2) Babel 8 in the unit specs.
4. Our packages build to the same `lib/` apart from quote style; all suites and CI are green.

## 9. Order and size

| Step | Items | Size |
|---|---|---|
| 1 | Confirm D1 to D3 | - |
| 2 | I1, I2 | S |
| 3 | I3, I4 | S |
| 4 | I5, I6 | S |
