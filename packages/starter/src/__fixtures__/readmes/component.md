# React Component

This project was generated with [Rockpack](https://github.com/AlexSergey/rockpack).

## Commands

Run the example app (`example/src`) in development mode with the component sources:

```shell
npm start
```

Build the component: the UMD bundle and the declarations into `dist`:

```shell
npm run build
```

Build the example app into `example/dist`:

```shell
npm run build:example
```

Run the tests (when the project was created with tests; `npm run test:watch` reruns them on changes):

```shell
npm test
```

Check the code: TypeScript (`lint:ts`), ESLint (`lint:code`), Stylelint (`lint:styles`) and the unused files and dependencies with knip (`lint:deps`):

```shell
npm run lint
```

Fix the formatting with Prettier and the fixable ESLint and Stylelint problems:

```shell
npm run format
```

Lint, test, build and publish the package to npm:

```shell
npm run production
```

## Claude Code Adaptation

**Rockpack** is optimized for AI-assisted development with Claude Code.

The project includes a well-structured `CLAUDE.md`, strong quality gates, and the built-in Code Style module to keep
AI-generated code consistent, maintainable, and production-safe.

This setup helps:

- reduce unrelated refactoring
- preserve existing architecture
- prevent low-quality code from entering the repository
- keep AI changes small and predictable
- reduce token usage through controlled context and cost-saving rules

Combined with strict CI validation and automated checks, AI tools integrate cleanly into the existing engineering
workflow without sacrificing code quality.
