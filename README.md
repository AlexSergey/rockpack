<p align="center">
  <img alt="Rockpack" src="https://www.rockpack.io/readme_assets/rockpack_logo.png">
</p>

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md">Readme (Russian version)</a>
</p>

**Rockpack** is a comprehensive solution that allows us to save time at the start of a project and start immediately solving business problems and avoid dealing with routines such as setting up webpack, jest, eslint etc.

**Rockpack** was designed with one goal in mind - to use previously created turnkey solutions as efficiently as possible. In its development, I tried to avoid the bike structure in order to make this tool as versatile as possible for every React project.

## Motivation

Working on many React projects from scratch, we are faced with the same type of routine tasks. We answer questions every time:

- *How to set up an efficient build system with support for many formats and Typescript we need*
- *Which linter's rules should be on the project for comfortable work*
- *How to set up Jest that it works with Babel or Typescript*
- *How to make server-side rendering to work with existing solutions - Redux, Apollo and other*
- *How to set up Webpack for server-side rendering and get production ready artifact and cool dev server*

Every time we spend weeks on these routine tasks.

<p align="center">
  <img width="500px" alt="Usual flow" src="https://www.rockpack.io/readme_assets/rockpack_main_1.v2.png">
</p>

Using **Rockpack** you can deploy your project in minutes and start writing really useful code.

<p align="center">
  <img width="500px" alt="Rockpack flow" src="https://www.rockpack.io/readme_assets/rockpack_main_2.png">
</p>

Also at the start of the project, we can create localization, setup logging, and we can do this practically without spending time.

## How to start
For setting up a project from scratch, the recommended approach is to use **@rockpack/starter**

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

If you can't use **@rockpack/starter** or want to migrate your existing application please follow the manual for each module

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)
- [@rockpack/logger](https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md#how-it-works)
- [@rockpack/localazer](https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md#how-it-works)

## Rockpack modules overview

**Rockpack** consists of modules. Let's consider them in more detail:

### @rockpack/starter

this is **create-react-app** on steroids. Supports the following types of applications:

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

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README.md" target="_blank">More details...</a>
***
### @rockpack/compiler

This is React bundler (based on Webpack) using a set of necessary loaders, plugins and using the best practices out of the box.

**@rockpack/compiler** can help you with:

- Compile your React application (TS/Babel)
- Compile React Component or VanillaJS UMD library (TS/Babel)
- Nodejs backend (TS/Babel)
- Markup html files
- Compile isomorphic (Server-side rendering) application (TS/Babel)
- Bundle analyze (TS/Babel)

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md" target="_blank">More details...</a>
***
### @rockpack/ussr

This is a small library providing SSR. Works with Redux, Apollo and other solutions.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md" target="_blank">More details...</a>
***
### @rockpack/tester

This is Jest with cool config, add-ons and fully compatible with TS / Babel.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md" target="_blank">More details...</a>
***
### @rockpack/codestyle

This is an efficiently customized Eslint with many best practical rules and additions.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md" target="_blank">More details...</a>
***
### @rockpack/logger

This is a logging system that will issue a report when an error occurs in the system. All actions that the user performed, buttons pressed, information about the OS, displays, browser, and more are recorded. This module allows you to understand the cause of the error.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md" target="_blank">More details...</a>
***
### @rockpack/localazer

This is a "correct" localization system for React applications that supports gettext so that localizers can work in a familiar environment.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md" target="_blank">More details...</a>
***
### @rockpack/babel

This is module helper, babel presets.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/babel/README.md" target="_blank">More details...</a>
***
*In order to get more detailed info please follow each module links.*

**Rockpack is completely free project. We are always open to collaboration and contributors.**

## Alternatives

The **Rockpack** project was inspired by:

- [Next.js](https://github.com/vercel/next.js/)
- [Creat React App](https://github.com/facebook/create-react-app)
- [Rome](https://github.com/romefrontend/rome)
- [Estrella](https://github.com/rsms/estrella)

## Why do we need Rockpack...?
...if we have **create-react-app** or other?
- **Rockpack** provides a very easy way to get started with **@rockpack/starter**. Just one command allows you to set up your application with support for TypeScript, Jest, Eslint, SSR and more.
- **Rockpack** is very flexible. You can design the architecture as you like, use different libraries and solutions, for example, for state management.
- **Rockpack** doesn't add any magic. This is a set of best practices and libraries for automating the start of a project.
- **Rockpack** has the option of modular integration into legacy project.
- **Rockpack** has the ability to modify the webpack.config without "eject" with the ability to update **Rockpack**.
- **Rockpack** uses only existing modules and approaches and don't reinventing the wheel.

## The MIT License

Copyright (c) Aleksandrov Sergey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
