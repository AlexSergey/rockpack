<p align="center">
  <img alt="Rockpack" src="https://www.natrube.net/rockpack/readme_assets/rockpack_logo_without_text.png">
</p>

# @rockpack/compiler

**@rockpack/compiler** is React bundler (based on Webpack) using a set of necessary loaders, plugins and using the best practices out of the box.

**@rockpack/compiler** this module is part of the **Rockpack** project. See more details on [the official site](https://alexsergey.github.io/rockpack/).

**@rockpack/compiler** can help you with:

- Compile your React application (TS/Babel)
- Compile React Component or VanillaJS UMD library (TS/Babel)
- Nodejs backend (TS/Babel)
- Markup html files
- Compile isomorphic (Server-side rendering) application (TS/Babel)
- Bundle analyze (TS/Babel)

## Features:

- Webpack 5+, Webpack-dev-server 4+
- TypeScript support
- Babel 7, Babel-preset-env (> 5%)
- Support build nodejs scripts with nodemon
- Hot Module Replacement for SPA
- Livereload for SSR
- Source maps and Extended dev mode
- Dotenv support and Dotenv safe support
- React optimizations
- Monorepo support
- Write file webpack plugin (in dev mode)
- Copy Webpack Plugin
- ESLint support
- Stylelint support
- Templates: HTML/Jade/Handlebars
- CSS: CSS/SASS (dart-sass)/LESS + Postcss
- Postcss, Autoprefixer
- CSS Modules support
- Imagemin
- Formats support: Markdown, Video, Audio, Fonts, SVG, Script, Shaders etc
- SVG + SVGO, SVGR (import SVG like React Component)
- Antd optimizations (With optimizations: auto replace momentjs to dayjs, import antd)
- Terser minification
- Generate stats.json (in production mode)
- SEO Optimizations
- Bundle Analyze (webpack-bundle-analyzer, Statoscope)
- Isomorphic compile support (include isomorphic styles, isomorphic dynamic imports - **@loadable**)
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
  isomorphicCompiler,
  markupCompiler,
  libraryCompiler,
  frontendCompiler,
  backendCompiler,
} = require('@rockpack/compiler');
```
### frontendCompiler(options[optional], callback[optional]);

*frontendCompiler* will build a **create-react-app** style React app (Babel / TypeScript)

*Options* - The settings object is the same for each compiler type:

| Prop | Value[<i>Default value</i>] | Description |
| --- | --- | --- |
| dist | String['./dist'] | The path for compiled app, by default **dist** |
| src | String['./src'] | The path for application source. By default "src", where will be find index.{js\|jsx\|ts\|tsx} |
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

Allows to process HTML files (HTML, handlebars, jade). Useful for markup

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
### isomorphicCompiler(configs[needed]);

Compiles an SSR application.

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
How do I activate Stylelint?
- *It's enough to put **.stylelintrc** or **stylelint.config.js** in the root with **@rockpack/compiler***
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
