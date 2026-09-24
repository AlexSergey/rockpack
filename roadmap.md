## Roadmap

### [9.0.0] - Work in Progress

#### Completed
- Full TypeScript rewrite of all packages (babel, codestyle, compiler, starter, tester, utils)
- New build pipeline: dual ESM/CJS output, `tsx`-based scripts
- Updated all examples to latest React and TypeScript
- Dropped legacy files: the SSR template's `rockpack.babel.js`, `jest.extend`
- Clean output before each build
- Improved tester configuration
- Updated lint-staged to 17
- E2E tests migrated to ES modules
- All configs and scripts migrated to TypeScript
- Fixed `.eslintrc` in webpack plugin

#### Completed
- Integrated `eslint-config-flat-gitignore` into `@rockpack/codestyle`
- Replaced hardcoded `ignores` array with `.eslintflatignore` file-based approach
- Recursive `.eslintflatignore` lookup from `process.cwd()` upward for monorepo support
- Disabled `@import-lite/no-default-export` and `@typescript-eslint/naming-convention` for `.d.ts` files

#### Completed (quality and infrastructure, see `plans/01-unit-tests.md` and `plans/02-recommendations.md`)
- Unit tests for every package with enforced coverage thresholds
- CI for build, lint, unit tests, examples and a nightly starter e2e; lint-staged hooks
- Fix git hooks initialization for starter projects (now `simple-git-hooks`)
- Dependency hygiene with knip and syncpack; Node.js 24 baseline
- Typed compiler errors and exit codes; shared build tooling; topological build

#### Pending
- End-to-end suites for the compiler, the starter (pinned and latest dependency modes) and the published packages (`plans/04-e2e.md`)
- Architecture, API and TypeScript coverage improvements (`plans/03-code-improvements.md`)
