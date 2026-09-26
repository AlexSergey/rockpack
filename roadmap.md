## Roadmap

### [9.0.0]

See the [CHANGELOG](./CHANGELOG.md) for the full list and the [migration guide](./MIGRATION.md) for the upgrade.

#### Completed
- Full TypeScript rewrite of all packages (babel, codestyle, compiler, starter, tester, utils); ESM and CommonJS builds, `@rockpack/codestyle` ESM only
- Packages build with shared `tsx` scripts; examples and generated projects run `node scripts.build.mts`
- Node.js 24.15 baseline, Babel 8, webpack-dev-server 6, ESLint 10, TypeScript 6
- `@rockpack/codestyle`: `.eslintflatignore` instead of the built-in ignore list, strict typescript-eslint presets, bug-catching rules, Testing Library and jest-dom for React tests
- `@rockpack/compiler`: typed results and errors, exit codes, option validation, own build reporter, type check with the project's `tsc`, bundle analyzer removed, own import-extension Babel plugin
- `@rockpack/starter`: git hooks with `simple-git-hooks`, knip, `.nvmrc`, SSR live reload
- Unit tests for every package with enforced coverage thresholds; end-to-end suites for the compiler, the starter (pinned and latest dependencies, runtime in a browser) and the published tarballs
- CI for build, lint, unit tests, examples, e2e and the book; lint-staged hooks; dependency hygiene with knip and syncpack
- Plans: `plans/01` to `plans/08`

### Next
- TypeScript 7 once typescript-eslint supports it (`plans/09-typescript-7.md`)
- 10.0: remove the deprecated `libraryCompiler('Name')` and `isomorphicCompiler(frontendCompiler(), backendCompiler())` forms, make `typescript: { env: true }` the default in `@rockpack/babel`
