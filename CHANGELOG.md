# Changelog

## [5.0.0 in progress]

- Zero vulnerabilities for all packages
- Replaced imagemin to sharp
- Dropped mandatory "I" prefix for interfaces
- Dropped deprecated babel plugins
- Removed unused modules
- Dropped addons from tester package. Improves customization.
- Added support CJS and ESM types for library template

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
