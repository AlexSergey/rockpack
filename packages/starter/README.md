<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/starter

**@rockpack/starter** is a CLI scaffolding tool for React applications. It generates a fully configured project — Webpack, TypeScript, ESLint, and Jest — in a single command.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Application types

- **React SPA** — Client-side React app with Webpack, TypeScript, ESLint, and Jest preconfigured.
- **React SPA + SSR** — Universal React app with SSR, hydration, and a Node.js server. No setup needed.
- **React Component** — NPM-ready React component with TypeScript declarations and an optimized bundle.
- **UMD Library** — Framework-agnostic UMD library for NPM, zero configuration required.

*All project types include:*
- Import support for many file formats. [Full list](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image and SVG optimization; SVG files importable as React components
- CSS/SCSS/Less modules with TypeScript support
- PostCSS: Tailwind, autoprefixer, postcss-custom-media, postcss-media-minmax
- SEO and React optimizations
- Dotenv and Dotenv safe support
- Bundle Analyzer, Statoscope
- GraphQL support

*Optional add-ons for each project type:*
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md) — ESLint with best-practice rules
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md) — pre-configured Jest setup

## AI-Assisted Development

Every project scaffolded by **@rockpack/starter** is ready for AI-assisted development from the first commit.

- **Test coverage from day one** — Jest is pre-configured, so AI-generated code is validated immediately.
- **Quality gates** — ESLint with strict rules prevents low-quality or inconsistent code from entering the repository.
- **Preconfigured `CLAUDE.md`** — optimized for minimal context usage, cost-efficient test runs, and architecture-consistent changes.

This makes Rockpack projects a reliable foundation for teams working with Claude Code or similar AI tools.

## Using

1. Installation:

```shell
npm i @rockpack/starter -g
```

2. Creating an app:

```shell
rockpack <project-name>
```

3. Select the type of application.

![Rockpack Starter](https://www.natrube.net/rockpack/readme_assets/rockpack_starter_1.v3.jpg)

***

## Arguments

`--yarn` — use Yarn as the default package manager:

```shell
rockpack <project-name> --yarn
```

***

*If you cannot use **@rockpack/starter** or want to migrate an existing application, refer to the manual for each module:*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
