<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/babel

**@rockpack/babel** provides Babel configuration for **@rockpack/compiler** and **@rockpack/tester**, covering React, TypeScript, and modern JavaScript syntax.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

It runs on Babel 8 (`@babel/core` 8) and needs Node.js 24.15 or newer. Plugins added through `rockpack.babel.*` must support Babel 8.

To add custom plugins, create `rockpack.babel.js` in the root of your project. Plugins defined there are merged into the base Babel config.

The file can also be `rockpack.babel.cjs`, `rockpack.babel.mjs` or `rockpack.babel.ts` (the first one found in this order is used). ES module configs use their default export. Export either an object, which is deep-merged into the defaults (arrays are concatenated), or a function that receives the context, the default options and `deepmerge`, and returns the final options:

```ts
// rockpack.babel.ts
import type { BabelMergeFunction } from '@rockpack/babel';

const merge: BabelMergeFunction = (context, opts, deepmerge) =>
  deepmerge(opts, { plugins: context.framework === 'react' ? ['babel-plugin-styled-components'] : [] });

export default merge;
```

The context holds `framework` (`'none' | 'react'`), `isNodejs`, `isTest`, `modules` and `typescript`. TypeScript configs are loaded through Node.js type stripping, so they may use only erasable syntax (no `enum` or `namespace`).

## Included presets and plugins

### Environment
- `@babel/preset-env` - targets browsers with > 5% usage and the latest Node.js LTS
- `babel-plugin-polyfill-corejs3` - when `core-js` is a dependency (not a devDependency) of the project, imports the polyfills the code uses and the targets lack (`method: 'usage-global'`, the `core-js` version from `package.json`)

### React
- `@babel/preset-react` (automatic runtime) through `@rockpack/babel/presets/react`, which skips `.ts`, `.mts` and `.cts` files, so generic arrow functions such as `<T>(value: T) => value` keep working there; JSX belongs in `.tsx`
- `babel-plugin-react-compiler` - enables the React Compiler for automatic memoization. On React 19 it uses the runtime built into `react`; on React 17 and 18 install the optional peer dependency `react-compiler-runtime` in your project
- `@babel/plugin-transform-react-constant-elements` - hoists static JSX elements out of render

### TypeScript
- `@babel/preset-typescript`
- `babel-plugin-transform-typescript-metadata` - enables TypeScript decorator metadata emission

In TypeScript mode only the types are stripped, so `modules`, `isNodejs` and `core-js` have no effect. Pass `typescript: { env: true }` to run `@babel/preset-env` after `@babel/preset-typescript` and apply them to TypeScript too:

```js
createBabelPresets({ isNodejs: true, modules: 'commonjs', typescript: { env: true } });
```

This becomes the default in 10.0.

### Modern syntax
- `@babel/plugin-proposal-decorators` - legacy (TypeScript `experimentalDecorators`) semantics, `version: 'legacy'`
- `@babel/plugin-proposal-do-expressions`

The pipeline operator is no longer included: Babel 8 dropped its `minimal` proposal. Add `@babel/plugin-proposal-pipeline-operator` with `proposal: 'hack'` or `'fsharp'` in `rockpack.babel.*` if you need it.

### Jest compatibility
- `@babel/plugin-transform-modules-commonjs`
- `babel-plugin-transform-import-meta`, preceded by a small Rockpack plugin that renames module-level `__filename`/`__dirname`, so `const __filename = fileURLToPath(import.meta.url)` keeps working in tests

## Import extension plugin

`@rockpack/babel/plugins/import-extension` gives the relative imports of a per-file build the extension of its output, so Node can load the emitted files. `@rockpack/compiler` uses it for the `esm` and `cjs` formats of `sourceCompiler` and `libraryCompiler`. It works with Babel 7 and Babel 8.

```js
plugins: [['@rockpack/babel/plugins/import-extension', { extension: 'mjs' }]]; // 'cjs' | 'js' | 'mjs'
```

It rewrites the source string of `import`, `export ... from`, `export * from` and dynamic `import('...')` with a string literal, and resolves like Node and TypeScript:

- `./sum.ts`, `./sum.js` (and the other script extensions `.jsx`, `.tsx`, `.mjs`, `.cjs`, `.mts`, `.cts`) become `./sum.mjs`;
- an existing file stays as it is, so assets such as `./styles.css` or `./data.json` keep their path;
- `./sum` becomes `./sum.mjs` when `sum.<script extension>` exists, and a file wins over a folder of the same name;
- `./utils` becomes `./utils/index.mjs` when the folder has an `index.<script extension>`;
- a specifier without an extension that matches nothing (a file generated during the build) gets the extension.

Bare specifiers, absolute paths, `#imports`, specifiers with `?` or `#`, and type-only imports and exports are never touched. Only the string changes, so import attributes (`with { type: 'json' }`) and quotes are kept. Hand-written `require('./x')`, `import.meta.resolve()` and TypeScript `import x = require()` are not rewritten.

## How the config is composed

`createBabelPresets(options)` composes the config from small modules in `src`: the plugins for the syntax proposals, React, TypeScript metadata and test mode (`plugins.ts`), the presets (`presets.ts`: `@babel/preset-typescript` for TypeScript, otherwise `@babel/preset-env` with the browser or Node.js targets), the core-js polyfills when `core-js` is a dependency (`core-js.ts`), the production-only React plugins, and finally `rockpack.babel.*` (`user-config.ts`), which is deep-merged or called as a merge function.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
