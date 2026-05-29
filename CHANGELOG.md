# Changelog

## [9.0.0] - Work in Progress

Full TypeScript migration across all packages, modernized build pipeline, and improved developer experience.

### Added
- All packages (babel, codestyle, compiler, starter, tester, utils) rewritten in TypeScript
- New build pipeline using `tsx` scripts for all packages and examples
- Dual ESM/CJS output for all packages
- Improved tester configuration with better type support for Jest
- `eslint-config-flat-gitignore` integration in `@rockpack/codestyle` - ignore patterns are now loaded from `.eslintflatignore` file instead of being hardcoded
- `.eslintflatignore` support: `makeConfig` searches for the file recursively from `process.cwd()` upward, enabling monorepo setups where a single file at the repo root covers all packages
- ESLint rules `@import-lite/no-default-export` and `@typescript-eslint/naming-convention` are now disabled for `.d.ts` files

### Changed
- All internal scripts migrated to TypeScript (`scripts.build.ts`, `scripts.tests.ts`)
- Updated examples to use latest React and TypeScript
- Build process now cleans output before each build
- Compiler configuration API improved: removed private internal fields

### Removed
- Dropped `rockpack.babel.js` legacy config file
- Dropped `jest.extend` from tester
- Removed CommonJS-only build artifacts
- Removed hardcoded `ignores` array from `@rockpack/codestyle` in favor of `.eslintflatignore`

## [8.0.0]

Version 8.0.0 is a major modernization release: the toolchain has been updated to support ESLint 10, TypeScript 6, and Tailwind CSS v4, while legacy and unmaintained integrations have been removed. It also introduces first-class AI-assisted development support, making Rockpack a solid foundation for teams working with tools like Claude Code.

### Added
- Adapted for AI-assisted development: preconfigured CLAUDE.md with quality gates, minimal-diff rules, and cost-efficient workflows for Claude Code and similar AI tools
- Tailwind CSS v4 support
- eslint-plugin-no-only-tests, eslint-plugin-import-lite, eslint-plugin-sonarjs, eslint-plugin-unicorn

### Changed
- Codestyle module reworked for ESLint 10 support
- Full TypeScript 6+ support
- Minimum Node.js version raised to 23
- Improved debugging in production
- Dependency updates

### Fixed
- Fixed d.ts generation for CSS Modules

### Removed
- Removed handlebars, pug, markupCompiler, webViewCompiler, outdated webpack plugins, and bower support

## [7.2.0]

- Updated all dependencies
- Fixed json linter
- Eslint was update to 10

## [7.1.0]

- Updated all dependencies
- Disabled package-json/require-type rule in codestyle
- Fixed breaking changes in rockpack/starter

## [7.0.0]

- Added React Compiler support
- Updated all dependencies
- Fixed security vulnerabilities
- Removed outdated code
- Improved overall performance

## [6.0.0]

- React 19 supports in all templates
- All dependencies were updated
- Fix vulnerabilities issues
- Templates simplification
- Performance improvements

## [5.0.0]

- Zero vulnerabilities for all packages
- Replaced imagemin to sharp
- Dropped mandatory "I" prefix for interfaces
- Dropped deprecated babel plugins
- Removed unused modules
- Dropped addons from tester package. Improves customization.
- Added support CJS and ESM types for library template
- Added Updater module to update dependencies automatically

## [4.5.0]

- Templates were refactored
- Changed react-router notation to the object style
- All dependencies were updated

## [4.4.0]

- ESLint 9 support
- Refactoring
- All dependencies were updated

## [4.3.0]

- ESLint 9 preparation for use
- Bug fixing
- Refactoring
- All dependencies were updated

## [4.2.0]

- Fixed bugs in **libraryCompiler**
- Provided ability to modify modules and plugins in compilers. The example for the customization compiler was updated
  regarding these changes.

## [4.1.0]

- Added [eslint-plugin-regexp](https://github.com/ota-meshi/eslint-plugin-regexp)
- Added [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)

## [4.0.0]

- A lot of fixes and optimizations
- Rework [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module:
  - Added [eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist)
  - Turned off all conflicts rules
  - Updated all deprecation warnings from Stylelint
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module integrated to each of project
- React Pure project added (include React, React-Dom only)
- Adopt the code to use [iSSR](https://github.com/AlexSergey/issr) the new version
- All dependencies were updated

## [3.0.0]

- A lot of fixes and optimizations
- The new [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/tree/master/packages/codestyle) module with best practices
   - Prettier added
   - Stylelint added
   - Commitlint added
   - Lintstaged added
   - Replaced simple-git-hooks to husky
- Typescript by default
- All dependencies were updated

## [2.0.0]

- A lot of fixes and optimizations
- All dependencies were updated
- The new React application templates
- webpack-plugin-serve -> webpack-dev-server4
- [the new official site](https://alexsergey.github.io/rockpack/)

## [1.9.0]

- babel config extend added

## [1.8.0]

- webpack-dev-server -> webpack-plugin-serve
- @rockpack/compiler simplification
- @rockpack/webpack-plugin-ussr-development added

## [1.6.1]

- Babel-ussr-plugin -> babel-plugin-ussr-marker

## [1.6.0]

- Babel-ussr-plugin added
- ts-loader, ts-jest -> @babel/preset-typescript

## [1.5.0]

- Simplification of USSR's api
- Small fixes
- added: Articles, [the official site](http://rockpack.io/)

## [1.1.0]

- fix(@rockpack/compiler): Side effects
- Small fixes
- added: Backbone for E2E tests

BREAKING CHANGES:

- Simplification of USSR API
- .modules.(s)css/less -> .module.(s)css/less (create-react-app compatibility)

## [1.0.0]
