# @rockpack/starter

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README_RU.md">Readme (Russian version)</a>
</p>

**@rockpack/starter** this is **create-react-app** on steroids. Supports the following types of applications:

- **React CSR** - React Client Side Render. Application skeleton in **create-react-app** style.
- **React SSR Light Pack** - React Server Side Render. Customized application for Server Side Render.
    - Koa is being used for the server
    - @loadable/components
- **React SSR Full Pack** - React Server Side Render. Application skeleton using best practices for project structure and a set of libraries
    - Koa is being used for the server
    - React-Router
    - Redux
    - Redux-Saga
    - React-Helmet-Async
    - @loadable/components
- **Library** - Configured webpack to create UMD library, both React Component and Vanilla JS
- **NodeJS app** - Support for ES6 Imports, source code minification, understandable Source Maps, etc.

*All types of applications support:*
- Import of many file formats. [List of formats](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image optimization, SVG Optimization
- Loading SVG files as React components
- CSS/SCSS/Less modules
- Babel or TS; TS support for CSS/SCSS/Less modules
- PostCSS Autoprefixer
- SEO Optimizations, React optimizations, Antd optimizations
- Support for settings via Dotenv and Dotenv safe
- Bundle Analyzer
- GraphQL support

Full list of features see [here](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)

*Additionally, for each type of application, you can install:*
- Configured ESLint with best practices rules [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md)
- Customized Jest with additions [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md)

**@rockpack/starter** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Using

1. Installation

```shell script
npm i @rockpack/starter -g
```

2. Creating an App
```shell script
rockpack <project name>
```

3. Select the type of application, select the required modules.

![Rockpack Starter](https://www.rockpack.io/readme_assets/rockpack_starter_1.v2.jpg)
***

*If you can't use **@rockpack/starter** or want to migrate your existing application please follow the manual for each module*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)
- [@rockpack/logger](https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md#how-it-works)
- [@rockpack/localazer](https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md#how-it-works)

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
