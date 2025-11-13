<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/babel

**@rockpack/babel** is Babel settings that provide modern JS syntax support for **@rockpack/compiler**, **@rockpack/tester**.

**@rockpack/babel** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

**@rockpack/babel** includes support for React, Jest, contains a number of optimizing plugins for React, and more. See below for a complete list of included features:

## Features:
To add additional plugins please make *rockpack.babel.js* in the root folder of your project and add plugins. These plugins will merge to common babel config.

### Babel:
- @babel/preset-env (browsers supporting > 5%, nodejs supporting the latest version)
- @babel/plugin-proposal-pipeline-operator
- @babel/plugin-proposal-do-expressions
- @babel/plugin-syntax-dynamic-import
- @babel/plugin-proposal-decorators

### React:
- @babel/preset-react

### React optimizations:
- @babel/plugin-transform-react-constant-elements
- @babel/plugin-transform-react-inline-elements

### Jest:
- @babel/plugin-transform-modules-commonjs

### Other:
- babel-plugin-import (Ant Design correct import modules)

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
