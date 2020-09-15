# @rockpack/compiler

**@rockpack/compiler** - основной модуль системы, позволяющий компилировать ваше React приложение используя webpack, набор необходимых лодеров, плагинов и используя лучшие практики по настройки из коробки.
- С помощью данного модуля вы сможете
- Скомпилировать ваше React приложение
- Скомпилировать библиотеку как для React так и для vanilla JS
- Nodejs backend
- markup html files
- собрать изоморфное приложение
- Провести анализ бандла

**@rockpack/compiler** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rock/blob/master/README.md" target="_blank">здесь</a>

### Features support:

- Webpack 4+, Webpack-dev-server
- TypeScript support
- Babel 7, Babel-preset-env (> 5%)
- Support build nodejs scripts with nodemon and livereload
- Dotenv support and Dotenv safe support
- React optimizations
- Write file webpack plugin (in dev mode)
- Copy Webpack Plugin
- ESLint
- Templates: HTML/Jade/Handlebars
- CSS: CSS/SASS/LESS + Postcss
- Postcss, Autoprefixer
- CSS Modules support
- Imagemin
- File import support: Markdown, Video, Audio, Fonts, SVG, Script, Shaders etc
- SVG + SVGO, SVGR
- Antd optimizations (momentjs to dayjs, import antd)
- Terser
- Generate stats.json (in production mode)
- SEO Optimizations
- Bundle Analyze
- Isomorphic compile support (include isomorphic styles, isomorphic dynamic imports, @loadable)
- Multi compile support
- Vendor array splitting support (You can set dependency libraries to this array to split it on separate vendor.js file)
- MD/MDX files support
- GraphQL support (webpack-graphql-loader)

## How it works

To compile simple React App like create-react-app example follow these steps:

1. Installation:

```sh
# NPM
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/compiler --dev
```

2. Create build.js file in project folder

3. Add code:
```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler();
```
4. Run build.js use:
```shell script
cross-env NODE_ENV=development node build
```

*Для того, чтобы провести production-ready сборку нужно запустить*

```shell script
cross-env NODE_ENV=production node build
```

Ваше приложение будет собрано, минифицированно, оптимизировано для продакшена.

## Details:

@rockpack/compiler has compilers:

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
#### frontendCompiler(options[optional], callback[optional]);

*frontendCompiler* can compile React frontend application (React, TypeScript etc)

*Options* - is an optional object. It's similar to every compiler:

| Key | Value[<i>Default value</i>] | Description |
| --- | --- | --- |
| dist | String['./dist'] | Path to the distribution folder. By default it will be "dist" folder in the root of project |
| src | String['./src'] | Path to the source folder. By default it will be "src" folder in the root of project with index.{jx|jsx|ts|tsx} file there |
| debug | Boolean[false] | Debug option can help to debug code on production. If debug - true the compiler will save all source maps |
| html | Boolean/Object[undefined] | It's object provide Html webpack plugin information about which files will be copy since we run compilation. Example: {  title: String, favicon: String[path to favicon], template: String[path_to_template] } |
| port | Number[3000] | webpack-dev-server port |
| styles | String[undefined] | Path to extract CSS styles (mini-css-extract-plugin) |
| banner | String[undefined] | Add banner to the head of JS and CSS files |
| global | Object[undefined] | Global variables to webpack.ProvidePlugin |
| copy | Object/Array[undefined] | Support files copying by copy-webpack-plugin. Format: {from: ... to: ...} or [] or {files: [], opts: {}} |

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  dist: 'public',
  src: 'src/main.js',
  debug: true,
  html: {
    title: 'New app',
    favicon: './favicon.ico',
    template: './index.ejs' // Support html, hbs, ejs
  },
  port: 8900
});
```
<b>Callback</b>. Every compiler has the last argument is callback. Callback is a function that will run after your webpack config will compile but before webpack will be started. This can help you to override some properties (You can see example below).

In the example below alias will be override
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

#### backendCompiler(options[optional], callback[optional]);

Can compile nodejs scripts and run nodemon in NODE_ENV development

```js
const { backendCompiler } = require('@rockpack/compiler');

backendCompiler(options, webpackConfig => {
  Object.assign(finalConfig.resolve, {
    alias: // add some aliases
  });
});
```

#### libraryCompiler(libraryName[needed], options[optional], callback[optional]);

Can compile UMD library

```js
const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler('MyLib', options);
```
#### markupCompiler(paths[needed], options[optional], callback[optional]);

Can compile markup (HTML, handlebars, jade files)

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
#### analyzerCompiler(options[optional], callback[optional]);

Compile your application and run webpack-bundle-analyzer

```js
const { analyzerCompiler } = require('rocket-starter');

analyzerCompiler(options);
```
Analyzer's page will be available on the port 8888

#### multiCompiler(configs[needed]);

Compile multi app. Or app with library or different cases.

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
#### isomorphicCompiler(configs[needed]);

Compile isomorphic. Более подробное описание, как создавать изоморфное прилоежние с помощью **rockpack** находится <a href="https://github.com/AlexSergey/rock/blob/master/packages/ussr/README.md" target="_blank">здесь</a>

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

**To see more examples please visit examples folder** - <a href="https://github.com/AlexSergey/rock/blob/master/packages/compiler/examples" target="_blank">here</a>

### Tips & tricks

TypeScript activation:
- make tsconfig.json
- add config (Example: https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

If you don't need to extract styles to css file in production version you will be able to set *styles: false*

*write: true* options will force Webpack to save file in HDD after each update webpack watcher / dev-server

You can add eslint config. Just add **eslintrc.js/.eslintrc.js** in your main (project) dir.

You can add postcss config. Just add postcss.config.js  in your main (project) dir.

## License

<a href="https://github.com/AlexSergey/rock/blob/master/LICENSE.md" target="_blank">MIT</a>
