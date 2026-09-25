# Plan 9: TypeScript 7

Status: proposed 2026-09-25, decisions D1 to D4 to confirm
Order: after Plan 8 and the 2026-09-25 dependency updates
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
| type-coverage 2.30.1, knip | monorepo | TypeScript API |

### 3.3 Where `typescript` is declared

- Root `package.json` devDependency `6.0.3`.
- Dependencies `6.0.3` of `@rockpack/codestyle`, `@rockpack/compiler` and `@rockpack/tester`; generated projects get `tsc` only through them (hoisting), `lint:ts` is `tsc --noEmit`.

### 3.4 Proven in a scratch project

`typescript: npm:@typescript/typescript6@6.0.2` plus `@typescript/native: npm:typescript@7.0.2`: `npx tsc -v` prints 7.0.2, `npx tsc6 -v` prints 6.0.3, `require('typescript')` is the 6.0.3 API, typescript-eslint `strictTypeChecked` reports typed rules, `tsc` passes.

## 4. Decisions to confirm

- **D1. Monorepo.** Recommended: the side-by-side setup at the root (`typescript` alias to `@typescript/typescript6`, `@typescript/native` alias to `typescript@7.0.2`), so every `lint:ts` runs TypeScript 7 and ESLint, type-coverage, knip and the compiler keep TypeScript 6. Alternative: stay on TypeScript 6 until 7.1.
- **D2. Published packages.** Recommended: `@rockpack/codestyle`, `@rockpack/compiler` and `@rockpack/tester` depend on `typescript: npm:@typescript/typescript6@6.0.2` instead of `typescript: 6.0.3` (same API; its binary is `tsc6`, so it never shadows a project's TypeScript 7 `tsc`). Alternative: keep `typescript: 6.0.3`, which installs a TypeScript 6 `tsc` next to a project's TypeScript 7 one, and the hoisting decides which `tsc` a project runs.
- **D3. Generated projects.** Recommended: the starter adds `@typescript/native: npm:typescript@7` to generated projects, so `lint:ts` type checks with TypeScript 7; `typescript` itself stays the TypeScript 6 API from the Rockpack packages. Alternative: generated projects stay on TypeScript 6 until 7.1.
- **D4. Release.** Recommended: in 9.0.0 (not released, already breaking). A project that installs `typescript@7` under the name `typescript` breaks typescript-eslint and the compiler's declaration generation; MIGRATION explains the aliases.

## 5. Work

### M1. Monorepo (D1, D2)

- [ ] Root: `typescript` alias to `@typescript/typescript6@6.0.2`, `@typescript/native` alias to `typescript@7.0.2`.
- [ ] `@rockpack/codestyle`, `@rockpack/compiler`, `@rockpack/tester`: the same `typescript` alias (syncpack keeps one version); drop the dependency where the package does not import TypeScript (check tester).
- [ ] Every workspace `lint:ts` runs TypeScript 7 (`tsc` resolves to `@typescript/native`); fix what TypeScript 7 reports.
- [ ] ESLint, type-coverage, knip, the compiler specs and compiler-e2e (`dts`, fork-ts-checker) keep passing on the TypeScript 6 API.
- [ ] The updater skips aliased dependencies (Plan 8 M8): note in the updater output or README how to bump the two aliases by hand.

Exit: `npm run lint`, `type-coverage`, `lint:deps`, `test:unit`, `e2e` pass; `npx tsc -v` at the root prints 7.x.

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
- Full verification (build, lint, unit, type-coverage, lint:deps, e2e, e2e:runtime, tester examples, book) and CI green.

## 7. Follow-up

- TypeScript 7.1 with the new API: move typescript-eslint, the compiler and fork-ts-checker when they support it, then drop `@typescript/typescript6`.
