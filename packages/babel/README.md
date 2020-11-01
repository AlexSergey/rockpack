# @rockpack/babel

**@rockpack/babel** is Babel settings that provide modern JS syntax support for **@rockpack/compiler**, **@rockpack/tester**.

**@rockpack/babel** this module is part of the **Rockpack** project. See more details on [the official site](https://www.rockpack.io/).

**@rockpack/babel** includes support for React, Jest, contains a number of optimizing plugins for React, and more. See below for a complete list of included features:

## Features:

### Babel:
- @babel/preset-env (browsers supporting > 5%, nodejs supporting the latest version)
- @babel/plugin-proposal-pipeline-operator
- @babel/plugin-proposal-do-expressions
- @babel/plugin-proposal-logical-assignment-operators
- @babel/plugin-proposal-optional-chaining
- @babel/plugin-proposal-nullish-coalescing-operator
- @babel/plugin-syntax-dynamic-import
- @babel/plugin-proposal-decorators
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-object-rest-spread

### React:
- @babel/preset-react

### React optimizations:
- @babel/plugin-transform-react-constant-elements
- @babel/plugin-transform-react-inline-elements
- babel-plugin-transform-react-pure-class-to-function
- babel-plugin-transform-react-remove-prop-types

### Jest:
- @babel/plugin-transform-modules-commonjs

### Other:
- @loadable/babel-plugin (support loadable components)
- babel-plugin-import (Ant Design correct import modules)

*@loadable/babel-plugin* allows you to organize dynamic import support for SSR applications.

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
