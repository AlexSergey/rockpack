<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/compiler

**@rockpack/compiler** is React bundler (based on Webpack) using a set of necessary loaders, plugins and using the best practices out of the box.

**@rockpack/compiler** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

**@rockpack/compiler** can help you with:

- Compile your React application (TS/Babel)
- Compile React Component or VanillaJS UMD library (TS/Babel)
- Node.js backend (TS/Babel)
- Compile isomorphic (Server-side rendering) application (TS/Babel)
- Bundle analysis

## Features:

- Webpack 5+, Webpack-dev-server 4+
- TypeScript support
- Babel 7, Babel-preset-env (> 5%)
- Support build nodejs scripts with nodemon
- Hot Module Replacement for SPA
- Livereload for SSR
- Source maps and Extended dev mode
- Dotenv support and Dotenv safe support: `.env` (or `.env.defaults` alone) in the project root is inlined into the bundle, `.env.defaults` fills the missing values and `.env.example` lists the required ones
- React optimizations
- Monorepo support
- Write file webpack plugin (in dev mode)
- Copy Webpack Plugin
- ESLint support
- Stylelint support
- HTML Files support
- CSS: CSS/SASS (dart-sass)/LESS + Postcss
- PostCSS: tailwind, autoprefixer, postcss-custom-media, postcss-media-minmax
- CSS Modules support
- Image minification by Sharp
- Formats support: Markdown, Video, Audio, Fonts, SVG, Script, Shaders etc
- SVG + SVGO, SVGR (import SVG like React Component)
- Terser minification
- Generate stats.json (in production mode)
- SEO Optimizations
- Bundle Analyze (webpack-bundle-analyzer, Statoscope)
- Isomorphic compile support (include isomorphic styles)
- Vendor array splitting support (You can set dependency libraries to this array to split it on separate vendor.js file)
- MD/MDX support
- GraphQL support (webpack-graphql-loader)
- Сross-env included

## Using

Basic bundling example:

1. Installation:

```sh
# NPM
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/compiler --dev
```

2. Make **build.mjs** in the root of project

3. Put the code:

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler();
```
4. Run **build.mjs**:
```shell script
cross-env NODE_ENV=development node build
```

*For production build you need run*

```shell script
cross-env NODE_ENV=production node build
```

Your app will be built, minified, and optimized for production.

## Details:

**@rockpack/compiler** includes compilers:

```js
const {
  isomorphicCompiler,
  libraryCompiler,
  frontendCompiler,
  backendCompiler,
} = require('@rockpack/compiler');
```
### frontendCompiler(options[optional], callback[optional]);

*frontendCompiler* builds a React SPA (Babel or TypeScript)

*Options* - The settings object is the same for each compiler type:

| Prop    | Value[<i>Default value</i>] | Description                                                                                                                                                    |
|---------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dist    | String['./dist']            | The path for compiled app, by default **dist**                                                                                                                 |
| src     | String['./src']             | The path for application source. By default "src", where will be find index.{js\|jsx\|ts\|tsx}                                                                 |
| debug   | Boolean[false]              | Debug option. Disable all the code mangling. It helps to find difficult bugs in minified code in production mode                                               |
| html    | Boolean/Object[undefined]   | This setting will activate Html webpack plugin. You can override the default index.ejs template. Example: {  title: String, favicon: String[path to favicon], template: String[path_to_template] } |
| port    | Number[3000]                | webpack-dev-server's port                                                                                                                                      |
| styles  | String[undefined]           | The path for CSS extraction (mini-css-extract-plugin)                                                                                                          |
| banner  | String[undefined]           | This parameter allows you to add a banner to JS and CSS files                                                                                                  |
| global  | Object[undefined]           | Allows forcing global variables using webpack.ProvidePlugin                                                                                                    |
| copy    | Object/Array[undefined]     | Copies files and folders using copy-webpack-plugin. Format: {from: ... to: ...} or [] or {files: [], opts: {}}                                                 |
| version | string[undefined]           | The application version will be displayed as a comment at the top of the HTML file                                                                                                                                                               |
| ignore  | String[][specs, tests, fixtures] | Globs that the per-file `esm`/`cjs` builds and the generated declarations skip |
| lint    | Boolean[false]              | Lints the sources with ESLint and Stylelint during the build when their configs exist in the project root; an error fails the build |
| cache   | Boolean[false]              | Production builds cache modules on disk in `node_modules/.cache/rockpack` (one cache per compiler). Repeated builds are faster, the first one is slower because it writes the cache; a change in the build script or in the compiler invalidates it. Delete the folder if a build looks stale |

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  dist: 'public',
  src: 'src/main.js',
  html: {
    title: 'New app',
    favicon: './favicon.ico',
    template: './index.ejs' // Supports html, hbs, ejs
  },
  port: 8900
});
```
**Callback** - each compiler has the last parameter - callback. This is a function in which you can override the properties of the generated webpack config.

In this example, alias will be extended via a callback function

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({}, (config) => {
  Object.assign(config.resolve, {
    alias: {
      react: '<path to react>'
    }
  });
});
```

### backendCompiler(options[optional], callback[optional]);

Compiles a **Node.js** application. When you run this compiler with NODE_ENV development, nodemon will be launched to restart the application after changes

```js
const { backendCompiler } = require('@rockpack/compiler');

backendCompiler(options, (config) => {
  Object.assign(config.resolve, {
    alias: {
      // add your aliases here
    }
  });
});
```

### libraryCompiler({ name, cjs, esm, externals }[needed], options[optional], callback[optional]);

Compile React Component or VanillaJS UMD library. `name` is the global the UMD bundle exposes; `cjs` and `esm` add per-file builds, `externals` keeps packages out of the bundle.

```js
const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({ name: 'MyLib' }, options);
```

With the per-file builds:

```js
const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({
  name: 'MyLib',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  },
  externals: [
    'react',
    'react-dom'
  ]
}, options);
```

The name-only form `libraryCompiler('MyLib', options)` still works but is deprecated and will be removed in 10.0.
### isomorphicCompiler({ frontend, backend, frontendCallback, backendCallback });

Compiles an SSR application: the frontend and backend options are the same as for `frontendCompiler` and `backendCompiler`, the callbacks are their optional second arguments. The two builds must write to different files.

```js
const { isomorphicCompiler } = require('@rockpack/compiler');

isomorphicCompiler({
  frontend: {
    src: 'src/client.jsx',
    dist: 'public',
  },
  backend: {
    src: 'src/server.jsx',
    dist: 'dist',
  },
});
```

The previous form, `isomorphicCompiler(frontendCompiler({...}), backendCompiler({...}))`, still works but is deprecated and will be removed in 10.0.

**You can see more examples in "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/examples" target="_blank">here</a>

## Results

`frontendCompiler`, `backendCompiler` and `libraryCompiler` resolve to a result that says what happened:

| `kind` | When | Fields |
|---|---|---|
| `config` | `configOnly` (and the parts of an isomorphic build) | `conf`, `webpackConfig` |
| `build` | Production, after the build has finished | `stats`, `success` |
| `dev-server` | `frontendCompiler` in development, once the server listens | `url`, `stop()` |
| `watch` | `backendCompiler` and `libraryCompiler` in development | `stop()` |

```ts
import { frontendCompiler } from '@rockpack/compiler';

const result = await frontendCompiler();
if (result.kind === 'dev-server') {
  console.log(`Open ${result.url}`);
  // later: await result.stop();
}
```

## Errors and exit codes

Invalid options and failed builds are reported as a `RockpackError` with a `code`:

| Code | Meaning |
|---|---|
| `INVALID_CONFIG` | The compiler options are incomplete or have the wrong shape; every option is checked before the build and the message names each problem with its path, for example `html[1].template must be a string` |
| `INVALID_ENTRY` | `src` is not a string |
| `BUILD_FAILED` | Compiling the library sources (`esm`/`cjs`) failed |
| `DTS_FAILED` | Generating the TypeScript declarations failed |

The compilers print `[rockpack] <code>: <message>`, set `process.exitCode = 1` and reject, so a build script can react to the failure:

```ts
import { libraryCompiler, RockpackError } from '@rockpack/compiler';

try {
  await libraryCompiler({ name: 'MyLib' });
} catch (error) {
  if (error instanceof RockpackError && error.code === 'INVALID_CONFIG') {
    // fix the options or fall back
  }
}
```

A production build ends with exit code `1` when webpack reports errors and `0` otherwise; the process exits on its own after the build instead of being killed. `Ctrl+C` exits with `130` and `SIGTERM` with `143`.

## Production debugging

**Rockpack** provides the ability to debug code in production by disabling all obfuscated code.

This allows you to run your application in a code environment as close to production as possible. In the source code, you'll see:

- Full path to the module file
- Real names of exported methods, classes and functions
- Saved console expressions (production builds for the browser drop them otherwise; Node.js builds such as `backendCompiler` or a `nodejs` library always keep them)

This can be helpful when tracking down complex bugs in production. To do this, set the debug true property in the compiler.

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  debug: true
});
```

### SourceMaps

- **Development**: source maps are embedded into the bundle (devtool: eval-source-map).
- **Production**: generated as hidden-source-map. You can enable them in Chrome DevTools (the Sources tab) if needed.

⚠️ It’s not recommended to deploy source maps to the server. For production debugging, upload them to Sentry and store them separately (e.g., in a bucket).

## Q&A

How do I activate TypeScript?
- *It's enough to put **tsconfig.json** in the root with **@rockpack/compiler***
- [tsconfig.json examples](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
***
How do I lint during the build?
- *Set `lint: true`. ESLint runs when the project root has a flat config (`eslint.config.{js,mjs,cjs,ts,mts,cts}`) and Stylelint when it has a Stylelint config (`.stylelintrc`, `.stylelintrc.{json,yaml,yml,js,mjs,cjs}` or `stylelint.config.{js,mjs,cjs}`); both check the sources only, and an error fails the build. ESLint is skipped with `debug: true`. Without the option the build does not lint; lint in your own scripts and git hooks instead (generated projects do).*
***
How do I extend PostCSS?
- *It's enough to put **postcss.config.js** in the root with **@rockpack/compiler***
***
Can I extend the webpack.config generated by **@rockpack/compiler**?
- Sure! This is one of the fundamental differences from **create-react-app**, out of the box extensibility without *eject*
- An example to work with Elm:

```js
const { frontendCompiler } = require('@rockpack/compiler');
const WebpackNotifierPlugin = require('webpack-notifier');

frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js']
}, (config, modules, plugins) => {
  config.resolve.extensions = ['.js', '.elm'];

  modules.set('elm', {
    test: /\.elm$/,
    exclude: [/elm-stuff/, /node_modules/],
    use: process.env.NODE_ENV === 'development' ? [
      { loader: 'elm-hot-webpack-loader' },
      {
        loader: 'elm-webpack-loader',
        options: {
          forceWatch: true
        }
      }
    ] : [
      {
        loader: 'elm-webpack-loader',
        options: {
          optimize: true
        }
      }
    ]
  });

  plugins.set('WebpackNotifierPlugin', new WebpackNotifierPlugin());
});
```
- [Example here](https://github.com/AlexSergey/rockpack/tree/master/packages/compiler/examples/advanced-config-elm-support)
***
Does the DEV build write files to disk?
- *Yes: the development server always writes the bundle to `dist` (`writeToDisk`), so a backend or another tool can read it; there is no option to turn it off.*
***
How do I process the TypeScript library to keep the sources?
- ***libraryCompiler** takes as the first parameter not only the string-name of the library, but also an object with parameters*
```js
libraryCompiler({
  name: 'Color',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
});
```
TypeScript sources will be saved in ESM and CJS format at the specified path.
***
How to work with CSS (SCSS, LESS) Modules?
- *You need to rename the file with modular styles to the format [filename].module.scss*
```jsx
import * as styles from './App.module.css';

<div className={styles.App}>
```
*CSS Modules support TypeScript with generating definitions - [dts-css-modules-loader](https://github.com/Megaputer/dts-css-modules-loader)*

The definitions (`App.module.scss.d.ts` next to `App.module.scss`) are written while webpack builds the styles, but the TypeScript check starts before that. Commit the generated `*.module.*.d.ts` files: without them the first build of a clean checkout fails with `TS2339: Property '...' does not exist on type 'typeof import("*.scss")'`, and only the next build passes. Build once after adding or renaming a class to update them.
***

## How a build is assembled

Every compiler goes through the same steps (`src/core/compile.ts`):

1. **Defaults and validation.** The options are merged with the defaults (`dist/index.js`, `src/index`, port `3000`, a free port in development) and validated once; every problem is reported with its path (`INVALID_CONFIG: html[1].template must be a string`).
2. **Context.** A compile context says whether the build only returns the webpack config and whether it is part of an `isomorphicCompiler` build (which also carries the live reload server). Nothing is kept on `global`.
3. **Config.** `make()` builds each part of the webpack config in its own module under `src/modules`: entry, output, devtool, dev server, optimization, rules (scripts, styles, assets), plugins, resolve, stats and externals. `--analyzer` on the command line turns the analyzer on (the mode comes from `--mode`, then `NODE_ENV`), then your callback receives the config, the rules and the plugins to change them.
4. **Run.** Production runs webpack once and resolves to `{ kind: 'build', stats, success }`; development starts watching (and the dev server for the frontend) and resolves to a result with `stop()`. `isomorphicCompiler` builds the frontend and the backend configs with one shared context and runs them together.

`sourceCompiler` and the `esm`/`cjs` formats of `libraryCompiler` do not use webpack: every source file is transpiled with Babel into the output folder, and the declarations are emitted by TypeScript from your `tsconfig.json`.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
