<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/starter

**@rockpack/starter** is a CLI scaffolding tool for React applications. It generates a fully configured project - Webpack, TypeScript, ESLint, and Jest - in a single command.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Application types

- **React SPA** - Client-side React app with Webpack, TypeScript, ESLint, and Jest preconfigured.
- **React SPA + SSR** - Universal React app with SSR, hydration, and a Node.js server. No setup needed. The server listens on `PORT` from `.env` (8888 by default).
- **React Component** - NPM-ready React component with TypeScript declarations and an optimized bundle.
- **UMD Library** - Framework-agnostic UMD library for NPM, zero configuration required.

*All project types include:*
- Import support for many file formats. [Full list](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image and SVG optimization; SVG files importable as React components
- CSS/SCSS/Less modules with TypeScript support
- PostCSS: Tailwind, autoprefixer, postcss-custom-media, postcss-media-minmax
- SEO and React optimizations
- Dotenv and Dotenv safe support
- GraphQL support

*Optional add-ons for each project type:*
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md) - ESLint with best-practice rules
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md) - pre-configured Jest setup

## AI-Assisted Development

Every project scaffolded by **@rockpack/starter** is ready for AI-assisted development from the first commit.

- **Test coverage from day one** - Jest is pre-configured, so AI-generated code is validated immediately.
- **Quality gates** - ESLint with strict rules prevents low-quality or inconsistent code from entering the repository.
- **Preconfigured `CLAUDE.md`** - optimized for minimal context usage, cost-efficient test runs, and architecture-consistent changes.

This makes Rockpack projects a reliable foundation for teams working with Claude Code or similar AI tools.

## Requirements

- **Node.js 24.15 or higher**

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

| Argument | Description |
|---|---|
| `--type=<csr\|ssr\|component\|library>` | Skip the application type question |
| `--tests=<true\|false>` | Skip the tests question |
| `-y`, `--yes` | Answer the remaining questions with the defaults (`csr`, with tests) |
| `--folder=<path>` | Create the project inside this folder |
| `--no-install` | Write the project without installing its dependencies |
| `--yarn` | Use Yarn instead of npm when it is installed |
| `--offline` | Write the dependency ranges from the starter's `versions.json` without asking the registry, and skip the update check |
| `--mode=test` | Pin the `@rockpack/*` dependencies to the starter's own version and skip the update check (used by the e2e tests) |
| `-v`, `--version` / `-h`, `--help` | Print the version / the usage |

```shell
rockpack my-app --type=csr --tests=true --yarn
```

Use `.` as the project name to scaffold into the current directory; the project is named after the folder (lower-cased, spaces replaced with `_`). The project name must be a valid npm package name.

Generated projects install their git hooks with `simple-git-hooks` on `npm install`: `pre-commit` runs lint-staged, `commit-msg` checks the message with commitlint, and `pre-push` runs the tests when the project has them.

***

*If you cannot use **@rockpack/starter** or want to migrate an existing application, refer to the manual for each module:*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-it-works)

## How a project is generated

`rockpack <name>` checks the arguments and the project name, then asks the questions that the flags did not answer. The project is then created step by step: the folder (and the `example` project for libraries and components), git, `.gitignore`/`.npmignore`, `package.json` with the dependencies resolved from the registry (or from `versions.json` with `--offline`), the template files (`templates/backbone/<type>`, shared components for `csr`/`ssr`, and the `claude`, `codestyle`, `git` and `tester` addons), the build script with the project name, `.env` and `.nvmrc`. Finally the dependencies are installed and the git hooks written. A failed step prints a report and the CLI exits with code `1`.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
