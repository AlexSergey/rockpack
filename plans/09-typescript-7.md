# Plan 9: TypeScript 7

Status: deferred 2026-09-25: stay on the latest TypeScript 6 (6.0.3) until the tools in 3.4 support TypeScript 7; M0 can be done before that
Order: after Plan 8 and the 2026-09-25 dependency updates; M1 to M3 start when typescript-eslint supports TypeScript 7
Owner: TBD

## 1. Goal

Type checking runs on TypeScript 7 (the native `tsc`, 7.0.2) in the monorepo and in generated projects, while every tool that needs the TypeScript API keeps working on TypeScript 6, the way the TypeScript team recommends until 7.1 ships a new API.

## 2. Non-goals

- Moving `@rockpack/compiler` off the TypeScript 6 API (declaration generation, `ForkTsCheckerWebpackPlugin`): there is no API in 7.0 to move to.
- Adopting TypeScript 7 only features or new defaults beyond what the switch needs.

## 3. Facts (checked on 2026-09-25)

### 3.1 TypeScript 7.0

- 7.0 ships no programmatic API: `require('typescript')` returns only the version (`lib/version.cjs`), the rest is under `./unstable/*`. The announcement expects a new, different API in 7.1 and asks tools that need the API to run TypeScript 6 side by side.
- The official side-by-side setup uses npm aliases: `typescript` becomes `npm:@typescript/typescript6` (the TypeScript 6 API, `tsc6` binary; it depends on `@typescript/old: npm:typescript@^6`, so the API is the real 6.0.3) and `@typescript/native` is `npm:typescript@^7.0.2` (the `tsc` binary).
- Options that became errors in 7.0 (`target: es5`, `baseUrl`, `moduleResolution: node10`/`classic`, `module: amd`/`umd`/`system`, `esModuleInterop: false`, ...) are not used by `@rockpack/tsconfig` (`ESNext`, `bundler`, `esModuleInterop: true`).
- TypeScript 7 `tsc --noEmit` passes today in all 44 workspaces with a tsconfig (only `packages/tsconfig`, which has no sources and no `lint:ts`, reports "No inputs").

### 3.2 Who needs the TypeScript 6 API

| Consumer | Where | Note |
|---|---|---|
| typescript-eslint 8.70.1 (latest, also canary) | `@rockpack/codestyle`, every `eslint` run | peer `typescript >=4.8.4 <6.1.0`, typed rules need a program |
| `generate-dts.ts`, `make-compiler-options.ts` | `@rockpack/compiler` | `import ts from 'typescript'` |
| `fork-ts-checker-webpack-plugin` 9.1.0 | `@rockpack/compiler` (`modules/plugins/checks.ts`) | type checking during builds |

### 3.3 Where `typescript` is declared

- Root `package.json` devDependency `6.0.3`.
- Dependencies `6.0.3` of `@rockpack/codestyle`, `@rockpack/compiler` and `@rockpack/tester`; generated projects get `tsc` only through them (hoisting), `lint:ts` is `tsc --noEmit`.

### 3.4 Every dependency on the TypeScript API (inventory of the installed tree)

| Dependency | Pulled in by | Needs the API | Maintained | Options |
|---|---|---|---|---|
| typescript-eslint 8.70.1 (`parser`, `eslint-plugin`, `type-utils`, `project-service`, ...) | `@rockpack/codestyle` | yes, typed rules | active | none: codestyle is built on it; the main blocker, wait for its TypeScript 7 support |
| `@eslint-react/*` 5.20.8 | `@rockpack/codestyle` | through typescript-eslint | active | follows typescript-eslint |
| eslint-plugin-sonarjs 4.2.1 | `@rockpack/codestyle` (9 rules) | yes; `typescript >=5 <6.1.0` is a regular dependency | active | works in a TypeScript 7 project through its own nested TypeScript 6 (about 23 MB extra); keep, see D7 |
| eslint-plugin-jest 29.16.6 | `@rockpack/codestyle` | optional peer | active | no action |
| fork-ts-checker-webpack-plugin 9.1.0 | `@rockpack/compiler` (build-time type check, issues to the reporter) | yes | last release 2025-04-03; old dependencies (chalk 4, fs-extra 10, memfs 3, minimatch 3, `@babel/code-frame` 7) | unlikely to adopt the new API soon; replace or drop, see D5 |
| `generate-dts.ts`, `make-compiler-options.ts` | `@rockpack/compiler` (own code) | `createProgram` + `emit` for declarations only | ours | run the `tsc` binary with a generated tsconfig that `extends` the project's one and lists the files, see D6 |
| type-coverage 2.30.1 | monorepo only | yes | slow | removed 2026-09-25 (D8) |
| cosmiconfig-typescript-loader 6.3.0 | commitlint (`@rockpack/codestyle/commitlint`) | no, loads configs with jiti; peer `>=5` | active | no action |
| `typescript` in `@rockpack/tester` | generated projects | no, only provides the `tsc` binary for `lint:ts` | - | no action |

### 3.5 Proven in a scratch project

`typescript: npm:@typescript/typescript6@6.0.2` plus `@typescript/native: npm:typescript@7.0.2`: `npx tsc -v` prints 7.0.2, `npx tsc6 -v` prints 6.0.3, `require('typescript')` is the 6.0.3 API, typescript-eslint `strictTypeChecked` reports typed rules, `tsc` passes.

## 4. Decisions to confirm

- **D1. Monorepo.** Recommended: the side-by-side setup at the root (`typescript` alias to `@typescript/typescript6`, `@typescript/native` alias to `typescript@7.0.2`), so every `lint:ts` runs TypeScript 7 and ESLint and the compiler keep TypeScript 6. Alternative: stay on TypeScript 6 until 7.1.
- **D2. Published packages.** Recommended: `@rockpack/codestyle`, `@rockpack/compiler` and `@rockpack/tester` depend on `typescript: npm:@typescript/typescript6@6.0.2` instead of `typescript: 6.0.3` (same API; its binary is `tsc6`, so it never shadows a project's TypeScript 7 `tsc`). Alternative: keep `typescript: 6.0.3`, which installs a TypeScript 6 `tsc` next to a project's TypeScript 7 one, and the hoisting decides which `tsc` a project runs.
- **D3. Generated projects.** Recommended: the starter adds `@typescript/native: npm:typescript@7` to generated projects, so `lint:ts` type checks with TypeScript 7; `typescript` itself stays the TypeScript 6 API from the Rockpack packages. Alternative: generated projects stay on TypeScript 6 until 7.1.
- **D4. Release.** Recommended: in 9.0.0 (not released, already breaking). A project that installs `typescript@7` under the name `typescript` breaks typescript-eslint and the compiler's declaration generation; MIGRATION explains the aliases.

- **D5. fork-ts-checker (can be decided now).** Recommended: replace it with a small own webpack plugin that runs the project's `tsc --noEmit --pretty false` (`--watch --preserveWatchOutput` in dev) next to the build and turns `file(line,col): error TSxxxx: message` into reporter problems; it works with TypeScript 6 and 7 alike (and is much faster on 7), and drops a stale plugin with twelve old dependencies. Alternative A: remove the build-time type check and make it opt-in (`typecheck: true`, like `lint: true` in C16), projects keep `lint:ts`. Alternative B: keep fork-ts-checker until it moves.
- **D6. Declarations (can be decided now).** Recommended: `generateDts` runs the `tsc` binary with a temporary tsconfig (`extends` the project's tsconfig, `files` = the selected sources, `declaration`, `emitDeclarationOnly`, `outDir`) instead of `createProgram`; the compiler then no longer imports `typescript` at all.
- **D7. sonarjs.** Recommended: keep; it carries its own TypeScript 6 and keeps working. Revisit only if it lags behind typescript-eslint. Alternative: drop it with its 9 rules (no clean replacements for `cognitive-complexity`, `no-identical-functions`, `no-unused-collection`, `prefer-immediate-return`).
- **D8. type-coverage.** Decided 2026-09-25: removed; the typescript-eslint `no-explicit-any` and `no-unsafe-*` rules (errors in `strictTypeChecked`) and `strict` guard against `any`. Only the count of type assertions is no longer measured.

## 5. Work

### M0. Compiler without the TypeScript API (D5, D6; independent of TypeScript 7, can run on TypeScript 6 now)

- [ ] Own type-check plugin in `packages/compiler/src/modules/plugins/` feeding the reporter (build: one run, errors fail the build like today; dev: `--watch`, problems on each rebuild); unit specs with a mocked child process.
- [ ] Remove fork-ts-checker-webpack-plugin; `format-errors.ts` reads the new problem shape.
- [ ] `generateDts` through the `tsc` binary; `make-compiler-options.ts` goes.
- [ ] compiler-e2e (`library` declarations, type errors in builds and dev) passes; CHANGELOG entry.

Exit: `@rockpack/compiler` has no `import ... from 'typescript'`; the `typescript` dependency only provides `tsc`.


### M1. Monorepo (D1, D2)

- [ ] Root: `typescript` alias to `@typescript/typescript6@6.0.2`, `@typescript/native` alias to `typescript@7.0.2`.
- [ ] `@rockpack/codestyle`, `@rockpack/compiler`, `@rockpack/tester`: the same `typescript` alias (syncpack keeps one version); drop the dependency where the package does not import TypeScript (check tester).
- [ ] Every workspace `lint:ts` runs TypeScript 7 (`tsc` resolves to `@typescript/native`); fix what TypeScript 7 reports.
- [ ] ESLint, the compiler specs and compiler-e2e (`dts`, fork-ts-checker) keep passing on the TypeScript 6 API.
- [ ] The updater skips aliased dependencies (Plan 8 M8): note in the updater output or README how to bump the two aliases by hand.

Exit: `npm run lint`, `lint:deps`, `test:unit`, `e2e` pass; `npx tsc -v` at the root prints 7.x.

### M2. Starter (D3)

- [ ] Generated projects get `@typescript/native: npm:typescript@7` (versions.json or the package.json preparing step); `lint:ts` stays `tsc --noEmit`.
- [ ] Generation goldens updated; the quality suite runs `lint:ts` on TypeScript 7 and ESLint on TypeScript 6.
- [ ] Packaging-e2e: the installed tarballs expose `tsc` 7 and the TypeScript 6 API side by side.

Exit: `e2e/starter-e2e` cli, generation, quality and runtime pass; `e2e:latest` passes.

### M3. Docs (D4)

- [ ] CHANGELOG: type checking on TypeScript 7, the TypeScript 6 API kept for ESLint and the compiler.
- [ ] MIGRATION: keep `typescript` as the TypeScript 6 API (`npm:@typescript/typescript6`), add `@typescript/native` for TypeScript 7; do not install `typescript@7` as `typescript` until 7.1.
- [ ] READMEs of `@rockpack/tsconfig`, `@rockpack/codestyle` and `@rockpack/compiler`.

## 6. Acceptance

- Root and generated projects type check with TypeScript 7; ESLint (typed rules), the compiler's declarations and build-time type checks run on the TypeScript 6 API.
- Full verification (build, lint, unit, lint:deps, e2e, e2e:runtime, tester examples, book) and CI green.

## 7. Follow-up

- TypeScript 7.1 with the new API: move typescript-eslint, the compiler and fork-ts-checker when they support it, then drop `@typescript/typescript6`.
