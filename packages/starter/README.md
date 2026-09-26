<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/starter

**@rockpack/starter** is a CLI scaffolding tool for React applications. It generates a fully configured project - Webpack, TypeScript, ESLint, and Jest - in a single command.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

## Application types

- **React SPA** - Client-side React app with Webpack, TypeScript, ESLint, and Jest preconfigured.
- **React SPA + SSR** - Universal React app with SSR, hydration, and a Node.js server. No setup needed. The server listens on `PORT` from `.env` (8888 by default).
- **React Component** - NPM-ready React component: a UMD bundle with TypeScript declarations in `dist` (React stays external), and an example app to develop it.
- **Library** - Framework-agnostic library for NPM: a UMD bundle and TypeScript declarations in `dist`, CommonJS and ES module builds in `lib`, published through an `exports` map (`import`, `require`, `types`), and an example app to develop it.

*All project types include:*
- Import support for many file formats. [Full list](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md)
- Image and SVG optimization; SVG files importable as React components
- CSS/SCSS/Less modules with TypeScript support
- PostCSS: Tailwind, autoprefixer, postcss-custom-media, postcss-media-minmax
- SEO and React optimizations
- Dotenv and Dotenv safe support
- GraphQL support

*Every project includes [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md)* - ESLint, Prettier, Stylelint (not for a library) and commitlint with strict rules.

*Optional:* [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md) - pre-configured Jest setup (the "Do you want tests?" question or `--tests`).

## What a generated project contains

- **Scripts** in `package.json`:
  - `start` - development mode (the example app for a library or component); an SSR app restarts its server and reloads the page on changes
  - `build` - production build; `build:example` builds the example app of a library or component
  - `test`, `test:watch` - Jest (when the project has tests)
  - `lint` - runs `lint:ts` (`tsc --noEmit`), `lint:code` (ESLint), `lint:styles` (Stylelint, not for a library) and `lint:deps` ([knip](https://knip.dev): unused files, exports and dependencies)
  - `format` - runs `format:prettier`, `format:code` (ESLint `--fix`) and `format:styles` (Stylelint `--fix`, not for a library)
  - `production` - lint, test, build and `npm publish` (library and component)
  - `lint:commit`, `pre-commit` - used by the git hooks
- **`scripts.build.mts` and `scripts.tests.mts`** - the build and test configuration in TypeScript, run by Node.js itself (`node scripts.build.mts`), no `tsx` or `ts-node` needed.
- **`.nvmrc`** - the Node.js major the starter requires.
- **Git hooks** via [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks), installed on `npm install`: `pre-commit` runs [lint-staged](https://github.com/lint-staged/lint-staged) (`.lintstagedrc.cjs`), `commit-msg` checks the message with commitlint, `pre-push` runs the tests when the project has them. A project created inside an existing git repository gets no repository and no hooks of its own (they belong to the parent repository); `.gitignore` and `.gitattributes` are always written.
- **knip configuration** in the `knip` field of `package.json`.
- **`CLAUDE.md`** - rules for AI-assisted development (see below).
- **`.env`** (copied from `.env.example`) for the csr and ssr apps, `.npmignore` for a library or component.

## AI-Assisted Development

Every project scaffolded by **@rockpack/starter** is ready for AI-assisted development from the first commit.

- **Test coverage from day one** - Jest is pre-configured, so AI-generated code is validated immediately.
- **Quality gates** - ESLint with strict rules prevents low-quality or inconsistent code from entering the repository.
- **Preconfigured `CLAUDE.md`** - optimized for minimal context usage, cost-efficient test runs, and architecture-consistent changes.

This makes Rockpack projects a reliable foundation for teams working with Claude Code or similar AI tools.

## Requirements

- **Node.js 24.15.0 or higher** (`>=24.15.0`)

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
| `<project-name>` | Project name (a valid npm package name), or `.` for the current directory |
| `--type=<csr\|ssr\|component\|library>` | Skip the application type question |
| `--tests=<boolean>` | Skip the tests question: `true`, `false`, `yes`, `no`, `1` or `0` (a bare `--tests` means `true`) |
| `--folder=<path>` | Create the project inside this folder, absolute or relative to the current directory |
| `--no-install` | Write the project without installing its dependencies |
| `--yarn` | Use Yarn instead of npm when it is installed |
| `--offline` | Write the dependency ranges from the starter's `versions.json` without asking the registry, and skip the update check. Installing the dependencies still needs the network (or a filled npm cache); combine with `--no-install` to only write the files |
| `-y`, `--yes` | Answer the remaining questions with the defaults (`csr`, with tests) |
| `-h`, `--help` | Print the usage |
| `-v`, `--version` | Print the version |

`--offline`, `--no-install` and `--yarn` accept the same boolean values as `--tests`. An unknown `--type` or a value that is no boolean prints an error and exits with code `1`. `--mode=test` is internal: it pins the `@rockpack/*` dependencies to the starter's own version and skips the update check (used by the e2e tests).

```shell
rockpack my-app --type=csr --tests=true --yarn
```

Use `.` as the project name to scaffold into the current directory; the project is named after the folder (lower-cased, spaces replaced with `_`). The project name must be a valid npm package name.

***

*If you cannot use **@rockpack/starter** or want to migrate an existing application, refer to the manual for each module:*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md#how-a-build-is-assembled)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md#how-the-jest-config-is-built)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md#how-the-config-is-composed)

## How a project is generated

`rockpack <name>` checks the arguments and the project name, then asks the questions that the flags did not answer. The project is then created step by step: the folder (and the `example` project for libraries and components), git (skipped inside an existing repository), `.gitignore`/`.gitattributes` and `.npmignore`, `package.json` with the dependencies resolved from the registry (or from `versions.json` with `--offline`), the template files (`templates/backbone/<type>`, shared components for `csr`/`ssr`, and the `claude`, `codestyle`, `git` and `tester` addons), the build script with the project name, `.env` and `.nvmrc`. Finally the dependencies are installed and the git hooks written. A failed step prints a report and the CLI exits with code `1`.

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
