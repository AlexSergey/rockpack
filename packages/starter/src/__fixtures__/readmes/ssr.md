# Single Page Application with Server Side Render (Typescript)

This project was generated with [Rockpack](https://github.com/AlexSergey/rockpack).

## Commands

Run the application in development mode (the server restarts and the page reloads on changes):

```shell
npm start
```

Build the production server into `dist` and the client into `public`:

```shell
npm run build
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

## Production

`npm run build` bundles the server together with its dependencies. To deploy, copy `dist` and `public` side by side (the server serves the client files from `../public`) and run them with the Node.js version from `.nvmrc`.

Start the built server:

```shell
node dist/index.js
```

The server listens on `PORT` from `.env` (8888 by default). The build inlines `.env` into the bundle, so set `PORT` there before `npm run build`: a `PORT` set when the server starts has no effect. To read the environment at startup, add `env: { runtime: true }` to the `backend` options in `scripts.build.mts`; `.env` then only gives the default values. See the [@rockpack/compiler README](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md) for `.env.defaults` and `.env.example`.

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
