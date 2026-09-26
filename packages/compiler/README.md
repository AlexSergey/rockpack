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

## Features:

- Node.js >=24.15.0
- Webpack 5+, Webpack-dev-server 6+
- TypeScript support
- Babel 8, Babel-preset-env (> 5%)
- Support build nodejs scripts with nodemon
- Hot Module Replacement for SPA
- Livereload for SSR
- Source maps and Extended dev mode
- Dotenv support and Dotenv safe support: `.env` (or `.env.defaults` alone) in the project root is inlined into the bundle, `.env.defaults` fills the missing values and `.env.example` lists the required ones
- React optimizations
- Monorepo support
- The development server writes the bundle to disk (`devMiddleware.writeToDisk`)
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
- SEO Optimizations
- Isomorphic compile support (include isomorphic styles)
- Vendor array splitting support (You can set dependency libraries to this array to split it on separate vendor.js file)
- MD/MDX support
- GraphQL support (@graphql-tools/webpack-loader)

## Using

Basic bundling example:

1. Installation:

```sh
# NPM
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/compiler --dev
```

2. Make **scripts.build.mts** in the root of the project (Node.js >=24.15.0 runs `.mts` files as they are)

3. Put the code:

```ts
import { frontendCompiler } from '@rockpack/compiler';

await frontendCompiler();
```

4. Run **scripts.build.mts**:

```shell script
node scripts.build.mts
```

*For production build you need run*

```shell script
NODE_ENV=production node scripts.build.mts
```

Your app will be built, minified, and optimized for production. The mode comes from `--mode` first, then from `NODE_ENV`, and is `development` otherwise. `NODE_ENV=...` before a command works in POSIX shells; for Windows shells add [cross-env](https://www.npmjs.com/package/cross-env) as a devDependency and run `cross-env NODE_ENV=production node scripts.build.mts`.

## Details:

**@rockpack/compiler** includes compilers:

```ts
import {
  backendCompiler,
  frontendCompiler,
  isomorphicCompiler,
  libraryCompiler,
  sourceCompiler,
} from '@rockpack/compiler';
```

### frontendCompiler(options[optional], callback[optional]);

*frontendCompiler* builds a React SPA (Babel or TypeScript). In development it starts webpack-dev-server with hot module replacement on `port` (or the next free port) and opens the browser.

*Options* - The settings object is the same for each compiler type (`CompilerConf`); every option is validated before the build:

| Prop    | Value[<i>Default value</i>] | Description |
|---------|-----------------------------|-------------|
| src     | String['src/index']         | The entry file; without an extension it is resolved like an import (`src/index.ts`, `src/index.tsx`, ...) |
| dist    | String['dist/index.js']     | The output file. A folder (no `.js` extension) gets `index.js` inside it |
| debug   | Boolean[false]              | Production builds keep readable module and chunk ids, keep `console` calls, add source maps to the styles, print the error details and every warning, and skip ESLint. The code is still minified |
| html    | Boolean/HtmlPage/HtmlPage[][true] | Pages made by html-webpack-plugin from the bundled `index.ejs` or your template. `false` turns the page off (`backendCompiler`, `libraryCompiler` and `isomorphicCompiler` have none by default). A page: `{ title, favicon, template, filename, code, inject, minify, templateParameters }`, see below |
| port    | Number[3000]                | The dev server port; the next free port is taken when it is busy |
| styles  | String/false[undefined]     | The extracted stylesheet. A path with `.css` (for example `css/app.css`) names the file, anything else keeps `css/styles.css`. `false` injects the styles with style-loader in production instead of extracting them (not in `isomorphicCompiler` builds) |
| banner  | Boolean/String[true]        | A comment at the top of the entry files. By default it is made from the `name`, `version`, `author`, `description` and `license` fields of your package.json; a string is used as the banner, `false` turns it off |
| global  | Object[undefined]           | Constants inlined by webpack.DefinePlugin: `{ API_URL: 'https://api' }` replaces `process.env.API_URL` in the code. Values must be strings |
| copy    | Object/Array[undefined]     | Copies files and folders using copy-webpack-plugin. Format: `{ from, to }`, an array of them or `{ files: [], opts: {} }` |
| version | String['1.0.0']             | The application version, shown as a comment at the top of the bundled HTML template (`version` template parameter) |
| vendor  | String[][undefined]         | Modules moved into a separate `vendor.js` entry, for example `['react', 'react-dom']` |
| externals | webpack externals[undefined] | Replaces the externals of the build (`backendCompiler` keeps `node_modules` external by default) |
| nodejs  | Boolean[false]              | `libraryCompiler`: build a Node.js library (target `node`, no page, `console` calls kept) |
| types   | String[`<dist folder>/types`] | `libraryCompiler` and `sourceCompiler` in a TypeScript project: the folder of the generated declarations, relative to the project root or absolute |
| esm, cjs | { src, dist }[undefined]   | `sourceCompiler` and `libraryCompiler`: per-file builds of the `src` folder into `dist` as `.mjs` or `.cjs`. `dist` must not be the project root, the sources or a folder holding them |
| ignore  | String[][specs, tests, fixtures] | Globs that the per-file `esm`/`cjs` builds and the generated declarations skip |
| lint    | Boolean[false]              | Lints the sources with ESLint and Stylelint during the build when their configs exist in the project root; an error fails the build. Install `eslint` and `stylelint` in your project (optional peer dependencies) |
| progress | Boolean[true]              | Progress bars in a terminal (one per compiler); `false` keeps the summaries and the problems but draws no bars. Outside a terminal and in CI there are never bars |
| watch   | Boolean[false]              | `sourceCompiler` only: after the first build, rebuild the formats and the declarations after every change in the sources until `stop()` of the result; keep `dist` outside the sources |
| cache   | Boolean[false]              | Production builds cache modules on disk in `node_modules/.cache/rockpack` (one cache per compiler). Repeated builds are faster, the first one is slower because it writes the cache; a change in the build script or in the compiler invalidates it. Delete the folder if a build looks stale |

*HtmlPage* - one page of `html`:

| Prop | Default | Description |
|---|---|---|
| title | the package name | The page title |
| favicon | none | The path to the favicon |
| template | the bundled `index.ejs` | An `.ejs` or `.html` template |
| filename | the template name + `.html` | The output file |
| code | none | Inline script put at the top of `<head>` by the bundled template |
| inject | `false` | html-webpack-plugin `inject`; the bundled template adds the scripts and styles itself |
| minify | whitespace collapsed in production | html-webpack-plugin `minify` |
| templateParameters | `{ version }` | Extra template parameters, merged over `version` |

```ts
import { frontendCompiler } from '@rockpack/compiler';

await frontendCompiler({
  dist: 'public',
  src: 'src/main.tsx',
  html: {
    title: 'New app',
    favicon: './favicon.ico',
    template: './index.ejs',
  },
  port: 8900,
});
```

**Callback** - each compiler takes a callback (`CompilerCallback`) as its last parameter. It receives the generated webpack config, the named rules and the named plugins (both a `Collection` with `get`, `set`, `add`, `modify` and `remove`) and the mode, and may change them before the config is built.

In this example, alias will be extended via a callback function

```ts
import type { CompilerCallback } from '@rockpack/compiler';

import { frontendCompiler } from '@rockpack/compiler';

const callback: CompilerCallback = (config) => {
  config.resolve = { ...config.resolve, alias: { react: '<path to react>' } };
};

await frontendCompiler({}, callback);
```

The option and callback types are exported: `CompilerConf`, `HtmlPage`, `CompilerCallback`, `Collection`, `Mode`, `LibraryCompilerOptions`, `IsomorphicCompilerOptions` and the result types below.

### backendCompiler(options[optional], callback[optional]);

Compiles a **Node.js** application. `node_modules` stay external, and `process.env.ROOT_DIRNAME` is the project root. When you run this compiler in development, nodemon runs the bundle (with the inspector on a free port from 9224) and restarts it after changes.

```ts
import { backendCompiler } from '@rockpack/compiler';

await backendCompiler({ src: 'src/server.ts', dist: 'dist' }, (config) => {
  config.resolve = { ...config.resolve, alias: { /* add your aliases here */ } };
});
```

### libraryCompiler({ name, cjs, esm, externals }[needed], options[optional], callback[optional]);

Compile React Component or VanillaJS UMD library. `name` is the global the UMD bundle exposes; `cjs` and `esm` add per-file builds, `externals` keeps packages out of the bundle. In a TypeScript project the declarations are generated into `types`. Set `nodejs: true` in the options for a Node.js library.

```ts
import { libraryCompiler } from '@rockpack/compiler';

await libraryCompiler({ name: 'MyLib' });
```

With the per-file builds:

```ts
import { libraryCompiler } from '@rockpack/compiler';

await libraryCompiler({
  name: 'MyLib',
  cjs: {
    src: './src',
    dist: './lib/cjs',
  },
  esm: {
    src: './src',
    dist: './lib/esm',
  },
  externals: ['react', 'react-dom'],
});
```

### isomorphicCompiler({ frontend, backend, frontendCallback, backendCallback });

Compiles an SSR application: the frontend and backend options are the same as for `frontendCompiler` and `backendCompiler`, the callbacks are their optional second arguments. The two builds must write to different files.

```ts
import { isomorphicCompiler } from '@rockpack/compiler';

await isomorphicCompiler({
  frontend: {
    src: 'src/client.tsx',
    dist: 'public',
  },
  backend: {
    src: 'src/server.tsx',
    dist: 'dist',
  },
});
```

In development:

- Both builds watch; nodemon runs the backend bundle and restarts it after every change. There is no webpack-dev-server and no browser is opened: your backend serves the page.
- The frontend build emits `dev-server.js`, the live reload client. Add it to the HTML your server renders in development only:
  ```ts
  const isProduction = process.env['NODE_ENV'] === 'production';

  res.send(`
    <div id="root">${html}</div>
    <script src="/index.js"></script>
    ${isProduction ? '' : '<script src="/dev-server.js"></script>'}
  `);
  ```
- After a change the page reloads once the restarted server answers, not before. The live reload server takes the first free port from 35729; both bundles get it as `process.env.LIVE_RELOAD_PORT`, and the client loads `livereload.js` from the host name of the page.
- The styles are extracted in both modes to `css/styles.css` in the frontend `dist` folder, or to the `.css` path of the `styles` option; link that file from your HTML.
- `process.env.ROOT_DIRNAME` in the backend is the project root.

`isomorphicCompiler` resolves to a `build` result in production, after both builds have finished, and to a `watch` result in development whose `stop()` closes both watching builds, the server nodemon runs and the live reload server.

### sourceCompiler(options[optional]);

Builds every source file of a folder on its own with Babel, without webpack, and the TypeScript declarations with your `tsconfig.json`. Use it for packages published as plain `.mjs`/`.cjs` files.

| Prop | Description |
|---|---|
| esm, cjs | `{ src, dist }`: the source folder and the output folder of each format; a format needs both |
| src | The declaration entry, `src/index` by default; the declarations are emitted for the TypeScript files of its folder |
| dist | Only places the default declarations folder (`<dist folder>/types`) |
| types | The declarations folder |
| ignore | Globs the formats and the declarations skip |
| watch | Rebuild after every change until `stop()` |
| debug, progress | As above |

```ts
import { sourceCompiler } from '@rockpack/compiler';

await sourceCompiler({
  cjs: { src: 'src', dist: 'lib/cjs' },
  esm: { src: 'src', dist: 'lib/esm' },
  types: 'types',
});
```

It resolves to `undefined` after the build, or to a `watch` result with `watch: true`. An error in the declarations (a type error the declaration emit reports) fails the build with `DTS_FAILED`.

### makeWebpackConfig(options[optional], callback[optional]), getArgs(), getWebpack()

- `makeWebpackConfig` resolves to the webpack config of a build with these options (the `frontendCompiler` defaults), without running it, for tools that take a webpack config.
- `getArgs<T>()` returns the parsed command-line arguments of the build script (yargs), typed as `T`.
- `getWebpack()` returns the webpack the compiler uses, for plugins such as `webpack.ProvidePlugin` in a callback.

**You can see more examples in "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/tree/master/examples/compiler" target="_blank">here</a>

### Deprecated

These forms still work and are removed in 10.0:

- `libraryCompiler('MyLib', options)`: pass `{ name: 'MyLib' }`.
- `isomorphicCompiler(frontendCompiler({...}), backendCompiler({...}))`: pass `{ frontend, backend }`.

## Build output

Rockpack prints the build itself: a progress bar per compiler while it builds (two rows, `client` and `server`, in an `isomorphicCompiler` build), then one line per build, and every problem in one format:

```
 ✔ client  built in 2.4s
   › Starting server on http://localhost:3000
 ✔ server  built in 1.1s
   › nodemon is running
 ↻ client  src/app.tsx changed
 ✖ client  1 error

   TypeScript  src/app.tsx:12:5  TS2339: Property 'title' does not exist on type 'Props'.
     > 12 |     <h1>{props.title}</h1>
```

- The facts of a compiler (dev server URL, nodemon, inspector port) follow its first successful build.
- Problem kinds: `Syntax`, `Module not found`, `TypeScript`, `ESLint`, `Stylelint` (with `lint: true`), `CSS` and `Build` for the rest; the same problem from the client and the server is shown once.
- Warnings are listed when the build has no errors and they differ from the previous build (or always with `debug: true`), and counted otherwise.
- In development the type checker reports after the build, as a separate `✖ client  N TypeScript errors` block.
- Without a terminal (CI, logs, piped output) the same lines are printed without bars or cursor movement, so the output can be read by tools. Colours follow the terminal, `NO_COLOR` and `FORCE_COLOR`.
- Production builds add the output folder and the size of the emitted files: ` ✔ frontend  built in 8.2s, dist  1.2 MB`.
- The per-file builds (`sourceCompiler`, the `esm`/`cjs` formats of `libraryCompiler`) report as `sources`, with a line per format and for the declarations:
  ```
   ✔ sources  built in 0.3s
     › cjs: 2 files in lib/cjs
     › esm: 2 files in lib/esm
     › declarations in dist/types
  ```
- When `dist` is a folder, the file the bundle goes to is shown as `› output: build/index.js`.
- Only an invalid configuration (`[rockpack] INVALID_CONFIG: ...`) and a crash of the build script itself are printed outside this format.

## Results

The compilers resolve to a result that says what happened:

| `kind` | When | Fields |
|---|---|---|
| `config` | `configOnly` (and the parts of an isomorphic build) | `conf`, `webpackConfig` |
| `build` | Production, after the build has finished (`isomorphicCompiler`: after both builds) | `stats`, `success` |
| `dev-server` | `frontendCompiler` in development, once the server listens | `url`, `stop()` |
| `watch` | `backendCompiler`, `libraryCompiler` and `isomorphicCompiler` in development; `sourceCompiler` with `watch: true` | `stop()` |

`sourceCompiler` without `watch` resolves to `undefined`. The types are `CompilerResult` (`BuildResult | ConfigResult | DevServerResult | WatchResult`) and `IsomorphicCompilerResult` (`BuildResult | WatchResult`).

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
| `INVALID_CONFIG` | The compiler options are incomplete or have the wrong shape; every option is checked before the build and the message names each problem with its path, for example `html[1].template must be a string`. Also an `esm`/`cjs` `dist` that is the project root, the sources or a folder holding them |
| `INVALID_ENTRY` | `src` is not a string |
| `BUILD_FAILED` | Compiling the library sources (`esm`/`cjs`) failed, or webpack could not apply the config (a plugin threw while it was set up) |
| `DTS_FAILED` | Generating the TypeScript declarations failed, including the errors the declaration emit reports |

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

**Rockpack** provides the ability to debug code in production with readable module names.

This allows you to run your application in a code environment as close to production as possible. In the source code, you'll see:

- Module and chunk ids named after their files
- Real names of classes and functions (kept in every production build)
- Saved console expressions (production builds for the browser drop them otherwise; Node.js builds such as `backendCompiler` or a `nodejs` library always keep them)

This can be helpful when tracking down complex bugs in production. To do this, set the debug true property in the compiler.

```ts
import { frontendCompiler } from '@rockpack/compiler';

await frontendCompiler({ debug: true });
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
How are the types checked?
- *Babel only strips the types; the check runs your project's own `tsc` (TypeScript 6 or 7, the compiler's TypeScript when the project has none) as `tsc --noEmit -p tsconfig.json` next to the build, incrementally, with its build info in `node_modules/.cache/rockpack/tsc`. It reports what `tsc --noEmit` reports for the files of the tsconfig, including syntax and tsconfig errors, except the `rootDir` layout (nothing is emitted); an error Babel already reported for a file is not repeated. A production build fails on a type error, a development build reports them after each rebuild. In the callback the plugin is `plugins.get('TypeCheckPlugin')`. The declarations of the per-file builds come from the same `tsc`.*
***
How do I lint during the build?
- *Set `lint: true`. ESLint runs when the project root has a flat config (`eslint.config.{js,mjs,cjs,ts,mts,cts}`) and Stylelint when it has a Stylelint config (`.stylelintrc`, `.stylelintrc.{json,yaml,yml,js,mjs,cjs}` or `stylelint.config.{js,mjs,cjs}`); both check the sources only, and an error fails the build. ESLint is skipped with `debug: true`. Without the option the build does not lint; lint in your own scripts and git hooks instead (generated projects do).*
***
How do I extend PostCSS?
- *Put **postcss.config.js**, **postcss.config.cjs** or **postcss.config.mjs** in the project root (the first one in this order wins); an ES module config (`export default`) works too. Your config replaces the bundled one (tailwind, postcss-media-minmax, postcss-custom-media, autoprefixer).*
***
Can I extend the webpack.config generated by **@rockpack/compiler**?
- Sure! This is one of the fundamental differences from **create-react-app**, out of the box extensibility without *eject*
- An example to work with Elm:

```ts
import { frontendCompiler } from '@rockpack/compiler';
import WebpackNotifierPlugin from 'webpack-notifier';

await frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js']
}, (config, modules, plugins) => {
  config.resolve = { ...config.resolve, extensions: ['.js', '.elm'] };

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
- [Example here](https://github.com/AlexSergey/rockpack/tree/master/examples/compiler/advanced-config-elm-support)
***
Does the DEV build write files to disk?
- *Yes: the development server always writes the bundle to `dist` (`writeToDisk`), so a backend or another tool can read it; there is no option to turn it off.*
***
How do I process the TypeScript library to keep the sources?
- *Pass `cjs` and `esm` to **libraryCompiler** (or use **sourceCompiler** without the UMD bundle)*
```ts
await libraryCompiler({
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
How do I analyze the bundle?
- *Rockpack does not ship an analyzer since 9.0.0: add the one you like in the callback. With [webpack-bundle-analyzer](https://github.com/webpack/webpack-bundle-analyzer) and `@types/webpack-bundle-analyzer` installed in your project:*
```ts
import { frontendCompiler } from '@rockpack/compiler';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

void frontendCompiler({}, (config, modules, plugins, mode) => {
  if (mode === 'production') {
    plugins.set(
      'BundleAnalyzerPlugin',
      new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false, reportFilename: 'webpack-report.html' }),
    );
  }
});
```
*Statoscope works the same way (`new StatoscopeWebpackPlugin()` from `@statoscope/webpack-plugin`, a default export). In an `isomorphicCompiler` build add the plugin in `frontendCallback` only. See [examples/compiler/analyzer](https://github.com/AlexSergey/rockpack/tree/master/examples/compiler/analyzer).*
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
3. **Config.** `make()` builds each part of the webpack config in its own module under `src/modules`: entry, output, devtool, dev server, optimization, rules (scripts, styles, assets), plugins, resolve, stats and externals. The mode comes from `--mode`, then `NODE_ENV`; then your callback receives the config, the rules and the plugins to change them.
4. **Run.** Production runs webpack once and resolves to `{ kind: 'build', stats, success }`; development starts watching (and the dev server for the frontend) and resolves to a result with `stop()`. `isomorphicCompiler` builds the frontend and the backend configs with one shared context, runs them together and resolves the same way.

`sourceCompiler` and the `esm`/`cjs` formats of `libraryCompiler` do not use webpack: every source file is transpiled with Babel into the output folder, and the declarations are emitted by TypeScript from your `tsconfig.json`. With `watch: true`, `sourceCompiler` resolves to a `watch` result and repeats this build after every change (Node.js `fs.watch`, changes within 100 ms rebuild once); a failed rebuild is reported and the watch goes on.


## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
