# @rockpack/starter

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README.md">Readme (English version)</a>
</p>

**@rockpack/starter** это **create-react-app** на стеройдах. Поддерживает следующие типы приложений:

- **React CSR** - React Client Side Render. Каркас приложения в стиле **create-react-app**.
- **React SSR Light Pack** - React Server Side Render. Настроенное приложение для Server Side Render.
    - Для сервера используется Koa
    - @loadable/components
- **React SSR Full Pack** - React Server Side Render. Каркас приложения с использованием лучших практик для структуры проекта и набор библиотек
    - Для сервера используется Koa
    - React-Router
    - Redux
    - Redux-Saga
    - React-Helmet-Async
    - @loadable/components
- **Библиотека** - Настроенный webpack для создания UMD библиотеки, как React Component так и Vanilla JS
- **NodeJS приложение** - Поддержка ES6 Imports, минификации исходного кода, понятные Source Maps и т.д.

*Все типы приложений поддерживают:*
- Импорт многих форматов файлов. [Список форматов](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md)
- Оптимизация изображений и SVG
- Загрузка SVG как React компонентов
- CSS/SCSS/Less modules
- Babel или TS, поддержка TS для CSS/SCSS/Less modules
- PostCSS Autoprefixer
- SEO Optimizations, React optimizations, Antd optimizations
- Поддержка настроек через Dotenv и Dotenv safe
- Bundle Analyzer
- Поддержка GraphQL

Полный список смотрите [здесь](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md)

*Дополнительно для каждого типа приложений можно установить:*
 - Настроенный ESLint с best practices правилами [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md)
 - Настроенный Jest с дополнениями [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md)

**@rockpack/starter** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

## Использование

1. Установка
```shell script
npm i @rockpack/starter -g
```

2. Создание приложения
```shell script
rockpack <project name>
```

3. Выбрать тип приложения, выбрать необходимые модули.

![Rockpack Starter](https://www.rockpack.io/readme_assets/rockpack_starter_1.v2.jpg)

***

*Если вы не можете использовать **@rockpack/starter** или хотите мигрировать ваше существующее приложение воспроьзуйтесь мануальной инструкцией для каждого модуля*

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md#how-it-works)
- [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md#how-it-works)
- [@rockpack/logger](https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README_RU.md#how-it-works)
- [@rockpack/localazer](https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README_RU.md#how-it-works)

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
