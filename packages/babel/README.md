<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/babel

**@rockpack/babel** provides Babel configuration for **@rockpack/compiler** and **@rockpack/tester**, covering React, TypeScript, and modern JavaScript syntax.

This module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

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

### React
- `@babel/preset-react`
- `babel-plugin-react-compiler` - enables the React Compiler for automatic memoization. On React 19 it uses the runtime built into `react`; on React 17 and 18 install the optional peer dependency `react-compiler-runtime` in your project
- `@babel/plugin-transform-react-constant-elements` - hoists static JSX elements out of render

### TypeScript
- `@babel/preset-typescript`
- `babel-plugin-transform-typescript-metadata` - enables TypeScript decorator metadata emission

### Modern syntax
- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-pipeline-operator`
- `@babel/plugin-proposal-do-expressions`

### Jest compatibility
- `@babel/plugin-transform-modules-commonjs`
- `babel-plugin-transform-import-meta`, preceded by a small Rockpack plugin that renames module-level `__filename`/`__dirname`, so `const __filename = fileURLToPath(import.meta.url)` keeps working in tests

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
