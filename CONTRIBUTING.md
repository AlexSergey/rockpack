# Contributing to Rockpack

Thanks for your interest in Rockpack! Bug reports, documentation fixes, recipes and code changes are all welcome.

## Where to start

- Issues labelled [`good first issue`](https://github.com/AlexSergey/rockpack/labels/good%20first%20issue) are small and well scoped, mostly documentation and recipes.
- Issues labelled [`help wanted`](https://github.com/AlexSergey/rockpack/labels/help%20wanted) need more knowledge of the code base.
- Issues labelled `blocked` wait for an upstream release; comment before starting one.
- Comment on an issue before you start working on it, so the work is not done twice.
- For a new feature or a change of behaviour, open an issue first and describe the use case.

## Repository layout

| Path | Contents |
|---|---|
| `packages/babel` | `@rockpack/babel`: Babel presets and plugins |
| `packages/codestyle` | `@rockpack/codestyle`: ESLint, Stylelint and commitlint configs |
| `packages/compiler` | `@rockpack/compiler`: webpack-based compilers and the build reporter |
| `packages/starter` | `@rockpack/starter`: the `rockpack` CLI and the project templates |
| `packages/tester` | `@rockpack/tester`: the Jest wrapper |
| `packages/tsconfig`, `packages/utils` | Shared TypeScript config and helpers |
| `e2e/*` | End-to-end suites: compiler, starter, packaging (published tarballs), babel smoke test |
| `examples/*` | Example projects for the compiler and the tester |
| `book/` | The documentation site |
| `plans/` | Working plans of the maintainers |

The monorepo uses npm workspaces with Lerna on top of Nx.

## Setup

Requirements: Node.js 24.15 or higher (see `.nvmrc`) and npm 11.

```shell
git clone https://github.com/AlexSergey/rockpack.git
cd rockpack
npm install
npm run build
```

Packages consume each other through their built `lib` folders, so run `npm run build` (or `npm run build:<package>`) after changing `utils`, `babel`, `codestyle`, `compiler` or `tester` and before running tests that depend on them.

## Checks

| Command | What it does |
|---|---|
| `npm run lint` | `tsc --noEmit` and ESLint in every package |
| `npm run lint:deps` | syncpack and knip (versions, unused files and dependencies) |
| `npm run lint:ts` | Type check of the root scripts |
| `npm run test:unit` | Unit tests of every package |
| `npm test -w packages/compiler` | Unit tests of one package |
| `npm run e2e` | End-to-end suites (slow) |
| `npm test -w e2e/compiler-e2e -- frontend` | One e2e spec (positional arguments filter the specs) |

Run only what your change touches: one package's tests and lint are usually enough, CI runs the rest.

- Nx caches build, lint and test results. Run `npx nx reset` when a result looks stale.
- Runtime e2e specs (`npm run e2e:runtime`) need Chrome: `npm exec -w e2e/tools -- puppeteer browsers install chrome`.
- Some e2e specs compare output with golden files. When a change is intended, update them with `E2E_UPDATE_GOLDEN=1`, for example `E2E_UPDATE_GOLDEN=1 npm test -w e2e/packaging-e2e -- tarballs`, and commit the updated files.

## Code style

- TypeScript in strict mode; avoid `any`, prefer `type` over `interface`.
- Keep the diff minimal and focused on the issue; do not reformat or refactor unrelated code.
- Formatting and lint rules come from `@rockpack/codestyle`; `npm run format -w <package>` fixes most findings.
- Add or update tests for every change in behaviour. Test files sit next to the source (`*.spec.ts`).
- Tests must be deterministic. Negative cases go first, positive cases after them, in separate `describe` blocks:

```ts
describe('readPackageJson', () => {
  describe('negative cases', () => {
    it('returns undefined when the file does not exist', () => {});
  });

  describe('positive cases', () => {
    it('returns the parsed package.json', () => {});
  });
});
```

- Update the package README when you change options or behaviour, and add a line to `CHANGELOG.md` under an `[Unreleased]` section at the top (create it if it is missing).

## Commits and pull requests

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) with the package as the scope: `fix(compiler): ...`, `feat(starter): ...`, `docs(tester): ...`, `test(babel): ...`.
- Git hooks run on install: `pre-commit` runs lint-staged, `pre-push` runs `npm run lint` and `npm run test:unit`.
- Open pull requests against the `next` branch.
- One topic per pull request; link the issue it closes (`Closes #123`).
- CI must be green before a review.

## Reporting bugs

Use the bug report template and include the Rockpack package versions, Node.js and npm versions, the operating system, the build or test script and the full output. A minimal repository that reproduces the problem helps the most.

## Code of conduct

By participating you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
