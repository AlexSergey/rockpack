# @rockpack/compiler

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md">Readme (Russian version)</a>
</p>

**@rockpack/compiler** is React bundler (based on Webpack) using a set of necessary loaders, plugins and using the best practices out of the box.

**@rockpack/compiler** can help you with:

- Compile your React application (TS/Babel)
- Compile React Component or VanillaJS UMD library (TS/Babel)
- Nodejs backend (TS/Babel)
- Markup html files
- Compile isomorphic (Server-side rendering) application (TS/Babel)
- Bundle analyze (TS/Babel)

**@rockpack/compiler** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Features:

- Webpack 4+, Webpack-dev-server
- TypeScript support
- Babel 7, Babel-preset-env (> 5%)
- Support build nodejs scripts with nodemon, livereload, source maps
- Dotenv support and Dotenv safe support
- React optimizations
- Write file webpack plugin (in dev mode)
- Copy Webpack Plugin
- ESLint support
- Templates: HTML/Jade/Handlebars
- CSS: CSS/SASS/LESS + Postcss
- Postcss, Autoprefixer
- CSS Modules support
- Imagemin
- File import support: Markdown, Video, Audio, Fonts, SVG, Script, Shaders etc
- SVG + SVGO, SVGR
- Antd optimizations (With optimizations: momentjs to dayjs, import antd)
- Terser minification
- Generate stats.json (in production mode)
- SEO Optimizations
- Bundle Analyze
- Isomorphic compile support (include isomorphic styles, isomorphic dynamic imports - **@loadable**)
- Multi compile support
- Vendor array splitting support (You can set dependency libraries to this array to split it on separate vendor.js file)
- MD/MDX support
- GraphQL support (webpack-graphql-loader)
- Сross-env included

## Using

**create-react-app** like bundling example:

1. Installation:

```sh
# NPM
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/compiler --dev
```

2. Make **build.js** in the root of project

3. Put the code:
```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler();
```
4. Run **build.js**:
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
  multiCompiler,
  isomorphicCompiler,
  markupCompiler,
  libraryCompiler,
  frontendCompiler,
  backendCompiler,
  analyzerCompiler,
} = require('@rockpack/compiler');
```
### frontendCompiler(options[optional], callback[optional]);

*frontendCompiler* will build a **create-react-app** style React app (Babel / TypeScript)

*Options* - The settings object is the same for each compiler type:

| Prop | Value[<i>Default value</i>] | Description |
| --- | --- | --- |
| dist | String['./dist'] | The path for compiled app, by default **dist** |
| src | String['./src'] | The path for application source. By default "src", where will be find index.{jx|jsx|ts|tsx} |
| debug | Boolean[false] | Debug option. Save source maps. It helps to find difficult bugs in minified code in production mode |
| html | Boolean/Object[undefined] | This setting will activate Html webpack plugin. You can override the default index.ejs template. Example: {  title: String, favicon: String[path to favicon], template: String[path_to_template] } |
| port | Number[3000] | webpack-dev-server's port |
| styles | String[undefined] | The path for CSS extraction (mini-css-extract-plugin) |
| banner | String[undefined] | This parameter allows you to add a banner to JS and CSS files |
| global | Object[undefined] | Allows forcing global variables using webpack.ProvidePlugin |
| copy | Object/Array[undefined] | Copies files and folders using copy-webpack-plugin. Format: {from: ... to: ...} or [] or {files: [], opts: {}} |

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  dist: 'public',
  src: 'src/main.js',
  debug: true,
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

frontendCompiler({}, webpackConfig => {
  Object.assign(finalConfig.resolve, {
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

backendCompiler(options, webpackConfig => {
  Object.assign(finalConfig.resolve, {
    alias: // add some aliases
  });
});
```

### libraryCompiler(libraryName[needed], options[optional], callback[optional]);

Compile React Component or VanillaJS UMD library

```js
const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler('MyLib', options);
```

*libraryName* может принимать объект с дополнительными настройками:

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
### markupCompiler(paths[needed], options[optional], callback[optional]);

Позволяет обрабатывать HTML файлы (HTML, handlebars, jade). Полезно при верстки макета

```js
const { markupCompiler } = require('rocket-starter');

markupCompiler(
  './src/**/*.{html,hbs,jade,njk}', // Glob format supported
  options,
  webpackConfig => {
    Object.assign(finalConfig.resolve, {
      alias: // add some aliases
    });
  });
```
### analyzerCompiler(options[optional], callback[optional]);

Builds the application and runs webpack-bundle-analyzer

```js
const { analyzerCompiler } = require('rocket-starter');

analyzerCompiler(options);
```
The analyzer page is available on port 8888

### multiCompiler(configs[needed]);

Allows you to compile multiple applications. Useful when developing a full stack of solutions (Nodejs + React application) or when building a UMD library + React application where this library will be used

```js
let { multiCompiler, frontendCompiler, libraryCompiler, backendCompiler } = require('rocket-starter');

multiCompiler(
  backendCompiler({
    src: './backend/src/index.js',
    dist: './backend/dist'
  }),
  frontendCompiler({
    src: './client/src/index.jsx',
    dist: './client/dist',
    banner: true,
    styles: 'style.css'
  }),
  libraryCompiler('MyLib', {
    src: './library/src/index.js',
    dist: './library/dist',
    html: false
  })
);
```
### isomorphicCompiler(configs[needed]);

Compiles an SSR application. For a more detailed description of how to create an isomorphic application using **Rockpack**, please see <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md" target="_blank">here</a>

```js
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('rocket-starter');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public',
  }),
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist',
  })
);
```

**You can see more examples in "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/examples" target="_blank">here</a>

## Q&A

How do I activate TypeScript?
- *It's enough to put **tsconfig.json** in the root with **@rockpack/compiler***
- [tsconfig.json examples](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
***
How do I activate Eslint?
- *It's enough to put **.eslintrc.js** or **.eslintrc.development.js** for DEV mode or **.eslintrc.production.js** for PRODUCTION mode in the root with **@rockpack/compiler***
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
How to make **Rockpack** save changes to HDD on DEV build?
- *Need to add to config **write: true***
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
import styles from './App.module.css';

<div className={styles.App}>
```
*CSS Modules support TypeScript with generating definitions - [@teamsupercell/typings-for-css-modules-loader](https://www.npmjs.com/package/@teamsupercell/typings-for-css-modules-loader)*
***

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
