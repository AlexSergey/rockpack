# Plan 8: Migrate to Babel 8

Status: approved 2026-09-25 (D1 to D5 as recommended)
Order: after Plan 7 (the own import extension plugin removes the only dependency that refuses Babel 8); closes issue #71
Owner: TBD

## 1. Goal

Every Rockpack package, the build tools, the templates and the examples run on Babel 8 (stable since 2026-06-16, `@babel/core` 8.0.6 on 2026-09-18) with the same compiled output wherever Babel 8 allows it, and every change a user can notice is decided here, listed in the CHANGELOG and explained in MIGRATION.md.

## 2. Non-goals

- New Babel features (`rewriteImportExtensions`, new proposals) beyond what the migration needs.
- Changing the targets policy (`> 5%` browsers, `current` Node).
- Replacing Babel with another transpiler.

## 3. Facts (checked on 2026-09-25 against the published 8.x packages)

### 3.1 Babel itself

- `@babel/core` 8 is ESM only (`"type": "module"`, one `default` export condition) and requires Node `^22.18.0 || >=24.11.0`. Rockpack declares `>=24.0.0`, so the minimum becomes 24.11.
- Our CommonJS builds that load Babel (`@rockpack/compiler` `lib/cjs`, `@rockpack/babel` `lib/cjs` only for types) reach it through Node's `require(esm)`, which works for synchronous modules on Node 24; to be proven by the packaging-e2e CJS checks.
- Babel 8 ships its own types: `@types/babel__core` (in `@rockpack/babel` and build-tools) goes.

### 3.2 Presets and plugins we configure

| Package (8.x) | What changes for us |
|---|---|
| `@babel/preset-env` 8.0.6 | `useBuiltIns` is removed ("use babel-plugin-polyfill-corejs3 instead"), `corejs` only works with it, `bugfixes` is removed (always on). We pass `useBuiltIns: 'usage'` and `corejs` when `core-js` is a dependency. |
| `@babel/preset-react` 8.0.1 | `useBuiltIns` and `useSpread` are removed (throw). We pass `useBuiltIns: true`. `runtime: 'automatic'` stays. |
| `@babel/preset-typescript` 8.0.1 | `allExtensions`, `isTSX`, `allowDeclareFields` are removed (throw); we pass none of them. |
| `@babel/plugin-proposal-decorators` 8.0.2 | `legacy: true` no longer exists: it is ignored and the plugin falls back to the `2023-11` proposal. Legacy decorators need `version: 'legacy'`. |
| `@babel/plugin-proposal-pipeline-operator` 8.0.1 | Only the `hack` and `fsharp` proposals are left; we use `minimal`, which now has no visitor. |
| `@babel/plugin-proposal-do-expressions` 8.0.1 | Still published, no option change seen. |
| `@babel/plugin-transform-react-constant-elements` 8.0.5, `@babel/plugin-transform-modules-commonjs` 8.0.1 | Published; our options (none / defaults) to be verified by the specs. |

### 3.3 Third-party packages

| Package | Babel 8 status |
|---|---|
| `babel-loader` 10.1.1 (compiler) | peer `^7.12.0 \|\| ^8.0.0-beta.1`: fine |
| `babel-jest` 30.x (tester) | peer `^7.11.0 \|\| ^8.0.0-0`: fine |
| `babel-plugin-transform-typescript-metadata` 0.4.0 | asserts `^7.0.0 \|\| ^8.0.0-0`: fine |
| `babel-plugin-transform-import-meta` | 2.3.3 (ours) targets Babel 7; 3.0.0 has peer `^8.0.1`: bump with the migration |
| `babel-plugin-polyfill-corejs3` 1.0.0 | peer `^7.4.0 \|\| ^8.0.0`: the new core-js path |
| `babel-plugin-react-compiler` 1.0.0 | no peer, generic `assertVersion(range)`: must be proven by a build (react example, csr/ssr templates) |
| `@issr/babel-plugin` 4.0.1 (ssr template) | no peer, no version assert: must be proven by the ssr runtime suite |
| `babel-plugin-add-import-extension` | asserts Babel 7: replaced by Plan 7 |

### 3.4 Where Babel is declared

`packages/babel` (core, seven `@babel/*` presets/plugins, three third-party plugins, `@types/babel__core`), `packages/compiler` (core, modules-commonjs, babel-loader), `packages/tester` (babel-jest), `tools/build-tools` (core, env, typescript, modules-commonjs, import-meta, `@types/babel__core`), the ssr template and `e2e/starter-e2e` (`@issr/babel-plugin`).

## 4. Decisions to confirm

- **D1. Pipeline operator.** `minimal` is gone. Recommended: drop `@babel/plugin-proposal-pipeline-operator` from the defaults (a Stage 2 proposal whose remaining variants have a different syntax, `hack` needs a topic token); users who want it add it in `rockpack.babel.*`. Alternative: switch to `hack` with `topicToken: '%'` (every existing `|>` in user code must be rewritten either way).
- **D2. Do expressions.** Still published. Recommended: keep as today for 9.0 (no user-visible change). Alternative: drop it together with the pipeline (both are early proposals).
- **D3. Decorators.** Recommended: `version: 'legacy'`, the same semantics as today's `legacy: true` (required by `babel-plugin-transform-typescript-metadata` users such as TypeORM, Inversify, NestJS-style code). Alternative: move to `2023-11` standard decorators (different runtime semantics, breaks metadata users).
- **D4. core-js polyfills.** Recommended: when `core-js` is a dependency, add `babel-plugin-polyfill-corejs3` with `method: 'usage-global'` and the `core-js` version, which is what `useBuiltIns: 'usage'` did. Alternative: stop injecting polyfills and document manual `import 'core-js/...'`.
- **D5. Release.** Recommended: in 9.0.0, since 9.0 is not released and already carries breaking changes (the Node minimum moves to 24.11 in every package, the starter and generated projects' `.nvmrc`/engines stay `24`). Alternative: 10.0.0 after a 9.0 on Babel 7.

## 5. Steps

Each item is one commit with the package checks and goldens; full verification (build, lint, test:unit, type-coverage, lint:deps, e2e, e2e:runtime, tester examples, book) before each push.

- [x] **M1. Prerequisite.** Plan 7 done (no Babel-7-only dependency left). _Done 2026-09-25: Plan 7 pushed (`8d2ab289`), CI green._
- [x] **M2. Build tools first.** Bump `tools/build-tools` to Babel 8 (`@babel/core`, `preset-env`, `preset-typescript`, `plugin-transform-modules-commonjs`, `babel-plugin-transform-import-meta` 3), drop `@types/babel__core`; build every package and diff `lib/` against the Babel 7 build; the differences are reviewed and noted here. _Done 2026-09-25, in one commit with M3 to M5 (syncpack keeps one version of each Babel package across workspaces, so build-tools cannot move alone). `TransformOptions` is `InputOptions` in Babel 8 and one-element plugin tuples are no longer typed. `lib/` diff against the Babel 7 build: only class fields declared without an initializer are now kept (`code;`, `dict;`, ...; preset-typescript 8 follows `useDefineForClassFields`), all of them assigned in their own constructor, so behaviour is unchanged._
- [x] **M3. `@rockpack/babel` on Babel 8.** Bump all `@babel/*` and the third-party plugins; apply D1 to D4 in `plugins.ts`/`presets.ts` (`presets.ts` loses `useBuiltIns`/`corejs` and gains `babel-plugin-polyfill-corejs3` per D4; preset-react loses `useBuiltIns`; decorators get `version: 'legacy'`); drop `@types/babel__core` (types from `@babel/core`); update `index.spec.ts` (expected presets and plugins), the public API type spec and the README (the plugin list, pipeline and decorators notes). _Done 2026-09-25: D1 to D4 applied; `babel-plugin-polyfill-corejs3` gets the same targets as preset-env and runs only where preset-env does. Found on the way: Babel 8 no longer turns JSX parsing off for `.ts` files when preset-react runs, which breaks `<T>(value: T) => value`; preset-react now comes through `@rockpack/babel/presets/react` (committed CJS like `plugins/`), which skips `.ts`/`.mts`/`.cts` through an override inside the preset, so it survives configs serialized to JSON (the tester passes its Jest config as JSON). preset-react 8 defaults `development` to the `development` env, so dev builds use `jsxDEV` (production builds are unchanged, `setMode` sets `BABEL_ENV`). The specs run in the tester's `esm: true` mode, because Jest's CommonJS runtime cannot load the ESM-only `@babel/core` 8; the D2 alias is now `babel-core-7`, so the import-extension plugin stays tested on both versions. A real transform checks the core-js injection._
- [x] **M4. Compiler.** `@babel/core` and `plugin-transform-modules-commonjs` to 8; `babel-loader` stays 10.1.1; `source-compile` with the Plan 7 plugin; unit specs and compiler-e2e (every fixture, including TypeScript with decorators, the source and library formats, the dev isomorphic build). _Done 2026-09-25: `source-compile.spec` mocks `@babel/core` (the real per-file output is covered by compiler-e2e); compiler-e2e 113/113 without golden changes. The monorepo root declares `@babel/core` 8 so it is the hoisted copy that `babel-loader` and `babel-jest` resolve (Jest, svgr and eslint-plugin-react-hooks still pull Babel 7, nested)._
- [x] **M5. Tester.** `babel-jest` against Babel 8 (test mode presets, `esm: true`), tester examples incl. `esm`. _Done 2026-09-25: the tester declares `@babel/core` 8 (the peer of `babel-jest`); tester unit specs and every tester example, including `esm`, pass._
- [x] **M6. Engines.** `engines.node` `>=24.11.0` in every package and the root, the starter's Node check (`bin/index.ts` compares the minor too), `engine-strict` in the monorepo; CI and `.nvmrc` stay on 24 (the runner's 24.x is newer than 24.11). _Done 2026-09-25: `>=24.11.0` in the root and every package; the starter bin checks `process.versions.node` against its own `engines.node` with `semver` (24.10 is refused, the message names the range); READMEs, MIGRATION and the CHANGELOG entry say 24.11._
- [ ] **M7. Templates and examples.** ssr template with `@issr/babel-plugin` under Babel 8 (starter quality and runtime suites), every compiler and tester example (examples suite), the book build.
- [ ] **M8. Canary and issue #71.** Run the major-update deps canary manually (temporary branch with a push trigger, as for Plan 4) and close #71 when the Babel part is green; remaining majors in the canary report are listed separately.
- [ ] **M9. Docs.** CHANGELOG: Breaking (Babel 8, Node 24.11, pipeline per D1, decorators per D3 if changed, core-js per D4, `rockpack.babel.*` plugins must support Babel 8); MIGRATION section with before/after for a `rockpack.babel.ts` that adds plugins and for pipeline code; `@rockpack/babel` README.

## 6. Risks

- **`babel-plugin-react-compiler` or `@issr/babel-plugin` fail on Babel 8.** Detected in M3/M7 by the react example and the ssr suites; fallback: pin the working version, open an upstream issue, or (react compiler) keep it behind the framework switch until fixed.
- **Output drift** (helpers, class fields, `bugfixes` always on): M2 diffs our own packages; the compiler and starter goldens show user-facing drift.
- **`require(esm)` of `@babel/core` from CJS builds**: verified by packaging-e2e's CommonJS consumer checks; fallback is `await import('@babel/core')` in the few CJS entry points.
- **Users' `rockpack.babel.*` configs with Babel 7-only plugins** break: MIGRATION lists the rule (their plugins must accept Babel 8) and how to find the offender (the error names the plugin).
- **Node 24.0 to 24.10 users** are refused by `engines`; the starter prints the requirement.

## 7. Acceptance

1. No `@babel/*` 7.x, `@types/babel__core` or Babel-7-only plugin in any `package.json` or the lockfile.
2. The default presets produce the same code for the unit fixtures as on Babel 7, except the changes decided in D1 to D4 and the drift noted in M2.
3. All suites (unit, e2e pinned and runtime, tester examples, book) and CI are green; the manual major canary no longer fails on Babel.
4. CHANGELOG and MIGRATION describe every user-visible change; issue #71 is closed.

## 8. Order and size

| Step | Items | Size |
|---|---|---|
| 1 | Confirm D1 to D5; Plan 7 done | - |
| 2 | M2, M3 | M |
| 3 | M4, M5, M6 | M |
| 4 | M7, M8, M9 | M |
