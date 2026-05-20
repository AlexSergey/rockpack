<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo.png">
</p>

[![Version](https://img.shields.io/npm/v/@rockpack/starter.svg?color=rgb(0,104,175)&labelColor=26272b)](https://www.npmjs.com/package/@rockpack/starter)
[![GitHub License](https://img.shields.io/badge/license-MIT-232428.svg?color=rgb(0,104,175)&labelColor=26272b)](https://www.npmjs.com/package/@rockpack/starter)

**Rockpack** is a zero-configuration toolkit for building React applications — with full support for **Server-Side Rendering (SSR)**, bundling, linting, and testing. In minutes, you can have a modern React app with production-ready quality gates, preconfigured tooling, and built-in support for AI-assisted development.

## Key Features

- **Zero-config setup**: Scaffold a complete React app with a single command.
- **SSR out of the box**: Universal rendering with hydration and a Node.js server, no manual configuration needed.
- **Production-ready quality gates**: Enforced ESLint, Prettier, TypeScript, and Jest conventions from day one.
- **Test coverage included**: Every project template ships with a configured Jest setup, so AI-generated code is validated immediately — before it ever reaches code review.
- **AI-first development**: Preconfigured `CLAUDE.md` with strict quality rules and cost-saving conventions makes working with AI tools like Claude Code fast, reliable, and economical.
- **Extensible**: Customize Webpack, ESLint, or Jest without ejecting.

## AI-Assisted Development

Rockpack is designed to make AI-assisted development **safe, fast, and cost-efficient**.

Beyond tooling, Rockpack establishes a **baseline architecture** — consistent project structure, naming conventions, and module boundaries — that AI models can reason about reliably. A well-structured codebase is not just easier for humans to navigate; it dramatically improves the quality of AI-generated code because the model has clear patterns to follow and fewer ambiguous decisions to make.

The combination of a defined architecture, test coverage, strict quality gates, and a well-tuned `CLAUDE.md` means AI tools like Claude Code can contribute to your codebase without introducing regressions or inconsistencies. Because every Rockpack project starts with linting and tests already configured, AI-generated code is reviewed automatically on every change.

The `CLAUDE.md` configuration is optimized for:

- **Minimal context usage** — rules guide the AI to read only what is relevant, reducing token consumption
- **Cost-efficient workflows** — targeted test runs instead of full-suite scans for isolated changes
- **Architecture consistency** — the AI preserves existing patterns instead of introducing unnecessary abstractions
- **Safe incremental changes** — small, predictable diffs that are easy to review
- **Quality enforcement** — ESLint, TypeScript strict mode, and Jest act as automated reviewers on every AI-generated change

## Getting Started

**Rockpack** is a good fit for:

- **Developers new to React** — bootstrap a project of any complexity in minutes, with Webpack, ESLint, and Jest already configured.
- **Large projects from scratch** — best-practice Webpack, ESLint, TypeScript, and Jest configuration that scales well.
- **Startups and prototypes** — skip the setup and validate ideas quickly.
- **Libraries and React components** — UMD, ESM, and CJS builds with TypeScript declarations, no configuration required.
- **Existing projects** — Rockpack is modular; use only the packages you need.

[Fast setup →](https://alexsergey.github.io/rockpack/#getting_started)

*Also, take a look at [iSSR](https://github.com/AlexSergey/issr) — a small module for adding SSR to an existing React app:*
- [ENG: Server-Side Rendering from zero to hero](https://dev.to/alexsergey/server-side-rendering-from-zero-to-hero-2610)
- [RU: Server-Side Rendering с нуля до профи](https://habr.com/ru/post/527310/)

***

### Motivation

Every new React project raises the same questions:

- How do I set up an efficient build system with TypeScript support?
- Which ESLint rules should I use?
- How do I configure Jest to work with Babel or TypeScript?
- How do I set up SSR with Redux, Apollo, or other solutions?
- How do I configure Webpack for server-side rendering and get a production-ready artifact with a working dev server?

Setting this up from scratch takes weeks. Rockpack solves it in minutes.

<p align="center">
  <img width="500px" alt="Usual flow" src="https://www.natrube.net/rockpack/readme_assets/rockpack_main_1.v3.0.png">
</p>

With **Rockpack**, you go from zero to a fully configured, running project in minutes and focus on writing the code that matters.

<p align="center">
  <img width="500px" alt="Rockpack flow" src="https://www.natrube.net/rockpack/readme_assets/rockpack_main_2.v3.0.png">
</p>

### Modules overview

**Rockpack** is modular. Each package can be used independently or together.

#### @rockpack/starter

A CLI scaffolding tool for React applications. Follows a feature-based project structure (see [this article](https://dev.to/alexsergey/project-structure-repository-and-folders-review-of-approaches-4kh2)).

Supported application types:

- **React SPA** — Client-side React app with Webpack, TypeScript, ESLint, and Jest preconfigured.
- **React SPA + SSR** — Universal React app with SSR, hydration, and a Node.js server.
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

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README.md" target="_blank">More details...</a>

***

#### @rockpack/compiler

A Webpack-based bundler with best-practice loaders and plugins preconfigured.

**@rockpack/compiler** supports:

- React applications (TypeScript or Babel)
- React components and VanillaJS UMD libraries
- Node.js backend applications
- Isomorphic (SSR) applications
- Bundle analysis with webpack-bundle-analyzer and Statoscope

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md" target="_blank">More details...</a>

***

#### @rockpack/tester

Pre-configured Jest with TypeScript and Babel support, HTML reporting, and best-practice defaults for React projects.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md" target="_blank">More details...</a>

***

#### @rockpack/codestyle

Opinionated ESLint configuration with Prettier, Stylelint, and Commitlint — ready to use out of the box.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md" target="_blank">More details...</a>

***

*For more information, follow the links to each module.*

**Rockpack is a free and open-source project. Contributions are always welcome.**

## Alternatives

The **Rockpack** project was inspired by:

- [Vite](https://vite.dev/)
- [Next.js](https://github.com/vercel/next.js/)
- [create-react-app](https://github.com/facebook/create-react-app)
- [Rome](https://github.com/romefrontend/rome)
- [Estrella](https://github.com/rsms/estrella)

## Why Rockpack?

- **One command to start** — `@rockpack/starter` scaffolds a complete app with TypeScript, Jest, ESLint, and SSR support.
- **Flexible architecture** — no opinions on state management or libraries; design the app the way you want.
- **No magic** — Rockpack is a curated set of best practices and libraries, not a black box.
- **Modular** — use only the packages you need, even in a legacy project.
- **No eject** — extend the Webpack config directly without losing the ability to update Rockpack.
- **No reinventing the wheel** — built on top of existing, well-maintained tools.

# The MIT License

[LICENSE](https://github.com/AlexSergey/rockpack/blob/master/LICENSE.md)
