## Roadmap

### [9.0.0] - Work in Progress

#### Completed
- Full TypeScript rewrite of all packages (babel, codestyle, compiler, starter, tester, utils)
- New build pipeline: dual ESM/CJS output, `tsx`-based scripts
- Updated all examples to latest React and TypeScript
- Dropped legacy files: `rockpack.babel.js`, `jest.extend`
- Clean output before each build
- Improved tester configuration
- Updated lint-staged to 17
- E2E tests migrated to ES modules
- All configs and scripts migrated to TypeScript
- Fixed `.eslintrc` in webpack plugin

#### Pending
- Fix husky initialization for starter projects (add pre-commit hooks)
