# @rockpack/babel

**@rockpack/babel** это настройки Babel обеспечивающие поддержку современного синтаксиса JS для **@rockpack/compiler**, **@rockpack/tester**.

**@rockpack/babel** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

**@rockpack/babel** включает в себя поддержку React, Jest, содержит ряд оптимизирующих плагинов для React и многое другое. Полный список включенных фич смотрите ниже:

[Readme (English version)](https://github.com/AlexSergey/rockpack/blob/master/packages/babel/README.md)

## Особенности:

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

### React Оптимизации:
- @babel/plugin-transform-react-constant-elements
- @babel/plugin-transform-react-inline-elements
- babel-plugin-transform-react-pure-class-to-function
- babel-plugin-transform-react-remove-prop-types

### Jest:
- @babel/plugin-transform-modules-commonjs

### Другое:
- @loadable/babel-plugin (support loadable components)
- babel-plugin-import (Ant Design correct import modules)

*@loadable/babel-plugin* позволяет организовать поддержку dynamic import для SSR приложений.

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
