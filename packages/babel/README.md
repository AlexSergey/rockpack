<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/babel

**@rockpack/babel** provides Babel configuration for **@rockpack/compiler** and **@rockpack/tester**, covering React, TypeScript, and modern JavaScript syntax.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

To add custom plugins, create `rockpack.babel.js` in the root of your project. Plugins defined there are merged into the base Babel config.

## Included presets and plugins

### Environment
- `@babel/preset-env` - targets browsers with > 5% usage and the latest Node.js LTS

### React
- `@babel/preset-react`
- `babel-plugin-react-compiler` - enables the React Compiler for automatic memoization
- `@babel/plugin-transform-react-constant-elements` - hoists static JSX elements out of render

### TypeScript
- `@babel/preset-typescript`
- `babel-plugin-transform-typescript-metadata` - enables TypeScript decorator metadata emission

### Modern syntax
- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-pipeline-operator`
- `@babel/plugin-proposal-do-expressions`

### Jest compatibility
- `@babel/plugin-transform-modules-commonjs`

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
