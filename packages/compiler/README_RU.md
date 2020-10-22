# @rockpack/compiler

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md">Readme (English version)</a>
</p>

**@rockpack/compiler** - основной модуль системы, позволяющий компилировать ваше React приложение используя webpack, набор необходимых лодеров, плагинов и используя лучшие практики по настройки из коробки.

**С помощью данного модуля вы сможете:**

- Скомпилировать ваше React приложение
- Скомпилировать библиотеку как для React так и для vanilla JS
- Nodejs backend
- Обработать markup html files
- Собрать изоморфное приложение
- Провести анализ бандла

**@rockpack/compiler** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

## Особенности:

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

## Использование

Для компиляции приложения в стиле create-react-app:

1. Установка:

```sh
# NPM
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/compiler --dev
```

2. Создайте **build.js** файл в корневой папке проекта

3. Добавьте код:
```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler();
```
4. Запустите **build.js**:
```shell script
cross-env NODE_ENV=development node build
```

*Для того, чтобы провести production-ready сборку, нужно запустить*

```shell script
cross-env NODE_ENV=production node build
```

Ваше приложение будет собрано, минифицированно, оптимизировано для продакшена.

## Детали:

**@rockpack/compiler** включает компиляторы:

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

*frontendCompiler* соберет React приложение в стиле **create-react-app** (Babel/TypeScript)

*Options* - Объект настроек, одинаков для каждого типа компилятора:

| Свойство | Значение[<i>Default value</i>] | Описание |
| --- | --- | --- |
| dist | String['./dist'] | Путь для скопилированного приложения, по умолчанию **dist** |
| src | String['./src'] | Путь к исходникам приложения. По умолчанию "src", где будет взят index.{jx|jsx|ts|tsx} |
| debug | Boolean[false] | Опция для дебага сохранит Source maps. Удобно для поиска коварных багов при минфицированной версии кода в production |
| html | Boolean/Object[undefined] | Эта настройка активирует Html webpack plugin. Можно переопределить index.ejs шаблон по умолчанию. Пример: {  title: String, favicon: String[path to favicon], template: String[path_to_template] } |
| port | Number[3000] | Порт для webpack-dev-server |
| styles | String[undefined] | Путь для извлечения стилей CSS (mini-css-extract-plugin) |
| banner | String[undefined] | Данный параметр позволяет добавить баннер в JS и CSS файлы |
| global | Object[undefined] | Позволяет пробросить глобальные переменные с помощью webpack.ProvidePlugin |
| copy | Object/Array[undefined] | Позволяет скопировать файлы и папки с помощью copy-webpack-plugin. Формат: {from: ... to: ...} или [] или {files: [], opts: {}} |

```js
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  dist: 'public',
  src: 'src/main.js',
  debug: true,
  html: {
    title: 'New app',
    favicon: './favicon.ico',
    template: './index.ejs' // Поддерживает html, hbs, ejs
  },
  port: 8900
});
```
**Callback** - у каждого компилятора есть последний параметр - callback. Это функция, в которой можно переопределить свойства сформированного webpack конфига.

В данном примере alias будут расширены через callback функцию
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

Позволяет скопилировать **Node.js** приложение. При запуске данного компилятора с NODE_ENV development будет запущен nodemon для перезапуска приложения после изменений

```js
const { backendCompiler } = require('@rockpack/compiler');

backendCompiler(options, webpackConfig => {
  Object.assign(finalConfig.resolve, {
    alias: // add some aliases
  });
});
```

### libraryCompiler(libraryName[needed], options[optional], callback[optional]);

Позволяет собрать UMD библиотеку (React / Vanilla JS)

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

Собирает приложение и запускает webpack-bundle-analyzer

```js
const { analyzerCompiler } = require('rocket-starter');

analyzerCompiler(options);
```
Страница анализатора доступна на порту 8888

### multiCompiler(configs[needed]);

Позволяет скомпилировать несколько приложений. Полезно при разработке full-stack решений (Nodejs + react приложение) или при сборке UMD библиотеки + React приложения где будет использована эта библиотека

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

Компилирует SSR приложение. Более подробное описание, как создавать изоморфное прилоежние с помощью **Rockpack** находится <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md" target="_blank">здесь</a>

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

**В папке "examples" находится больше примеров** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/examples" target="_blank">here</a>

## Вопросы/Ответы

Как активировать TypeScript?
- *Достаточно поместить **tsconfig.json** в корень с **@rockpack/compiler***
- [Примеры tsconfig.json](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
***
Как активировать Eslint?
- *Достаточно поместить **.eslintrc.js** или **.eslintrc.development.js** для DEV режима или **.eslintrc.production.js** для PRODUCTION режима в корень с **@rockpack/compiler***
***
Как расширить PostCSS?
- *Достаточно поместить **postcss.config.js** в корень с **@rockpack/compiler***
***
Я могу расширить webpack.config сгенерированный **@rockpack/compiler**?
- Конечно! Это одно из фундаментальных отличий от **create-react-app**, расширяемость из коробки без *eject*
- Пример, позволяющий работать с Elm:
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
- [Полный пример по ссылке](https://github.com/AlexSergey/rockpack/tree/master/packages/compiler/examples/advanced-config-elm-support)
***
Как заставить **Rockpack** сохранять изменения на HDD при DEV сборке?
- *Нужно добавить в конфиг **write: true***
***
Как обработать TypeScript библиотеку, чтобы сохранить исходники?
- ***libraryCompiler** принимает первым параметром не только строку-имя библиотеки но и объект с параметрами*
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
Таким образом, TypeScript исходники будут сохранены в формате ESM и CJS по указанному пути.
***
Как работать с CSS(SCSS, LESS) Modules?
- *Нужно переименовать файл с модульными стилями в формат [имя_файла].module.scss*
```jsx
import styles from './App.module.css';
...
<div className={styles.App}>
```
*Для версии проекта с TypeScript будут генерироваться файлы definitions, при помощи [@teamsupercell/typings-for-css-modules-loader](https://www.npmjs.com/package/@teamsupercell/typings-for-css-modules-loader)*
***

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
