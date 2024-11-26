<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo.png">
</p>

[![Version](https://img.shields.io/npm/v/@rockpack/starter.svg?color=rgb(0,104,175)&labelColor=26272b)](https://www.npmjs.com/package/@rockpack/starter)
[![GitHub License](https://img.shields.io/badge/license-MIT-232428.svg?color=rgb(0,104,175)&labelColor=26272b)](https://www.npmjs.com/package/@rockpack/starter)

**Rockpack** is a lightweight, zero-configuration solution for quickly setting up a React application with full support for
**Server-Side Rendering (SSR)**, bundling, linting, and testing. In just 5 minutes, you can get up and running with a modern
React app that's optimized for performance and best practices. Perfect for developers who want to skip the setup and
focus on building their app!

- **Instant SSR**: Seamlessly integrate server-side rendering for better SEO and faster initial page loads.
- **Smart Bundling**: Out-of-the-box support for bundling with optimal performance.
- **Automatic Linting**: Maintain code quality with built-in linting and style checks.
- **Ready for Testing**: Pre-configured testing environment with popular tools like Jest.

## Key Features:

- **Zero-config setup**: Start building immediately with minimal setup.
- **React, SSR, and Webpack integration**: All in one package for efficient development.
- **Optimized for production**: Bundle, lint, test, and render with best practices.
- **Extensible**: Easily customize for more advanced use cases.

Get started with **Rockpack** today and streamline your React app development!

## Getting Started:

**Rockpack** will help if:

- **Beginners.** With the help of Rockpack, any newbie to React can deploy a project of any complexity in a few minutes, with configured webpack, eslint, jest, etc. Rockpack supports the most popular types of React application with the project structure, Server Side Rendering, optimizations, and has the necessary dependencies.
- **Large projects from scratch.** Rockpack supports most of the webpack best practices configurations, eslint rules, jest, typescript and will work great even on large projects
- **Startup.** If you need to quickly check an idea without wasting time on unfolding and setting up the project.
- **Library or React Component.** If you want to write a UMD library or React component, with support for the esm/cjs build as well as the minified version.

[Fast setup](https://alexsergey.github.io/rockpack/#getting_started)

- **Legacy projects or modular use.** Rockpack is a modular platform, you can only use what you need. Please see every modules' readme.

*Also, pay attention to module [iSSR](https://github.com/AlexSergey/issr). This tiny module helps you to move your React application to Server-Side Rendering. Please see articles:*
- [ENG: Server-Side Rendering from zero to hero](https://dev.to/alexsergey/server-side-rendering-from-zero-to-hero-2610)
- [RU: Server-Side Rendering с нуля до профи](https://habr.com/ru/post/527310/)

***

### Motivation

Working on many React projects, we are faced with the same type of routine tasks. We answer questions every time:

- *How to set up an efficient build system with support for many formats and Typescript we need*
- *Which linter's rules should be on the project for comfortable work*
- *How to set up Jest that it works with Babel or Typescript*
- *How to make server-side rendering to work with existing solutions - Redux, Apollo and other*
- *How to set up Webpack for server-side rendering and get production ready artifact and cool dev server*

Every time we spend weeks on these routine tasks.

<p align="center">
  <img width="500px" alt="Usual flow" src="https://www.natrube.net/rockpack/readme_assets/rockpack_main_1.v2.0.png">
</p>

Using **Rockpack** you can deploy your project in minutes and start writing really useful code.

<p align="center">
  <img width="500px" alt="Rockpack flow" src="https://www.natrube.net/rockpack/readme_assets/rockpack_main_2.png">
</p>

### Modules overview

**Rockpack** consists of modules. Let's consider them in more detail:

#### @rockpack/starter

this is **create-react-app** on steroids.

**Rockpack** provides the best practice to set up your application. Project structure has feature based approach (see article [here](https://dev.to/alexsergey/project-structure-repository-and-folders-review-of-approaches-4kh2)).

Supports the following types of applications:

- **React SPA** - Redux, Thunk, React-Router, CSS Modules, @loadable, project structure etc.
    - React-Router
    - Redux
    - Redux Toolkit
    - Redux-Thunk
    - React-Helmet
    - @loadable/components is being used for split your code into SSR application
- **React SPA + SSR** - SSR, SEO, Redux, Thunk, React-Router, CSS Modules, @loadable, project structure etc.
    - Koa is being used for the server
    - iSSR is being used for effect handling in the server side
    - React-Router
    - Redux
    - Redux Toolkit
    - Redux-Thunk
    - React-Helmet-Async
    - @loadable/components is being used for split your code into SSR application
- **React Component** - Configured webpack to create React component (for NPM publishing).
- **UMD Library** - Configured webpack to create UMD library (vanilla JS, for NPM publishing).

*All types of applications support:*
- Import of many file formats. [List of formats](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image optimization, SVG Optimization
- Loading SVG files as React components
- CSS/SCSS/Less modules
- Babel or TS; TS support for CSS/SCSS/Less modules
- PostCSS: autoprefixer, postcss-custom-media, postcss-media-minmax
- SEO Optimizations, React optimizations, Antd optimizations
- Support for settings via Dotenv and Dotenv safe
- Bundle Analyzer, Statoscope
- GraphQL support

Full list of features see [here](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)

*Additionally, for each type of application, you can install:*
- Configured ESLint with best practices rules [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md)
- Customized Jest with additions [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md)

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README.md" target="_blank">More details...</a>
***
#### @rockpack/compiler

This is React bundler (based on Webpack) using a set of necessary loaders, plugins and using the best practices out of the box.

**@rockpack/compiler** can help you with:

- Compile your React application (TS/Babel)
- Compile React Component or VanillaJS UMD library (TS/Babel)
- Nodejs backend (TS/Babel)
- Markup html files
- Compile isomorphic (Server-side rendering) application (TS/Babel)
- Bundle Analyzer, Statoscope (TS/Babel)

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md" target="_blank">More details...</a>
***
#### @rockpack/tester

This is Jest with cool config, add-ons and fully compatible with TS / Babel.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md" target="_blank">More details...</a>
***
#### @rockpack/codestyle

This is an efficiently customized Eslint with many best practical rules and additions.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md" target="_blank">More details...</a>
***
*In order to get more detailed info please follow each module links.*

**Rockpack is completely free project. We are always open to collaboration and contributors.**

## Alternatives

The **Rockpack** project was inspired by:

- [Vite](https://vite.dev/)
- [Next.js](https://github.com/vercel/next.js/)
- [create-react-app](https://github.com/facebook/create-react-app)
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

Copyright (c) Sergey Aleksandrov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
