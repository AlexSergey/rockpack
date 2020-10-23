<p align="center">
  <img alt="Rockpack" src="https://www.rockpack.io/readme_assets/rockpack_logo.png">
</p>

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md">Readme (English version)</a>
</p>

**Rockpack** это комплексное решение, которое позволяет нам экономить время на старте проекта и начать сразу решать боевые задачи, писать бизнес логику, а не в очередной раз иметь дело с рутиной, такой как настройки webpack и прочих вещей.

**Rockpack** был разработан с одной целью - использовать ранее созданные готовые решения максимально эффективно. В его разработке я старался избегать велосипедо строения, чтобы сделать данный инструмент максимально универсальным для каждого React проекта

## Мотивация

Работая над многими проектами на React с нуля мы сталкиваемся с однотипными рутинными задачами. Мы каждый раз отвечаем на вопросы:

- *Как настроить эффективно систему сборки с поддержкой множества необходимых нам форматов и Typescript*
- *Какие правила выстроить для линтера, чтобы было комфортно работать*
- *Как подружить Jest с нашей системой, чтобы он обрабатывал последний синтаксис Babel или Typescript*
- *Как сделать серверный рендеринг правильно, чтобы он работал с готовыми решениями, такими как Redux или Apollo*
- *Как настроить Webpack под сервер сайд рендеринг и иметь на выходе готовый артефакт для продакшена и отзывчивый дев сервер*

Каждый раз на эти рутинные задачи мы тратим недели времени.

<p align="center">
  <img alt="Usual flow" src="https://www.rockpack.io/readme_assets/rockpack_main_1.v2.png">
</p>

Используя **Rockpack** вы сможете развернуть проект за считанные минуты и начать писать действительно полезный код.

<p align="center">
  <img alt="Rockpack flow" src="https://www.rockpack.io/readme_assets/rockpack_main_2.png">
</p>

Также на этапе старта проекта мы можем заложить такие фичи как - локализация, логирование и это мы можем сделать практически без затрат по времени.

## С чего начать
Для настройки проекта с нуля рекомендованный подход является использование **@rockpack/starter**

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

Если вы не можете использовать **@rockpack/starter** или хотите мигрировать ваше существующее приложение воспроьзуйтесь мануальной инструкцией для каждого модуля

- [@rockpack/compiler](https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md#how-it-works)
- [@rockpack/tester](https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md#how-it-works)
- [@rockpack/ussr](https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md#how-it-works)
- [@rockpack/codestyle](https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md#how-it-works)
- [@rockpack/logger](https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README_RU.md#how-it-works)
- [@rockpack/localazer](https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README_RU.md#how-it-works)

## Обзор модулей Rockpack

**Rockpack** состоит из модулей. Рассмотрим их по подробнее:

### @rockpack/starter
**create-react-app** на стеройдах. Поддерживает следующие типы приложений:

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

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/starter/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/compiler
Данный модуль позволяет компилировать ваше React приложение используя webpack, набор необходимых лодеров, плагинов и используя лучшие практики по настройки из коробки.

**С помощью данного модуля вы сможете:**

- Скомпилировать ваше React приложение (TS/Babel)
- Скомпилировать библиотеку как для React так и для vanilla JS (TS/Babel)
- Nodejs backend (TS/Babel)
- Обработать html для верстки
- Собрать изоморфное приложение (TS/Babel)
- Провести анализ бандла (TS/Babel)

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/ussr

Небольшая библиотека обеспечивающая SSR. Работает с Redux, Apollo и прочими решениями.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/tester

Полностью совместим с TS/Babel настроенный Jest, с множеством полезных дополнений.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/codestyle

Эффективно настроенный Eslint с множеством best practice правил и дополнений.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/logger

Это система логирования, которая будет выдавать отчет при возникновении ошибки в системе. Записываются все действия, которые совершал пользователь, нажатые кнопки, информация о ОС, дисплеи, браузере и прочем. Этот модуль позволяет понять причину возникновения ошибки.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/localazer

Это система "правильной" локализации React приложения, которое поддерживает gettext для того, чтобы локализаторы могли в привычной среде.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README_RU.md" target="_blank">Подробнее...</a>
***
### @rockpack/babel

вспомогательный модуль, babel presets.

<a href="https://github.com/AlexSergey/rockpack/blob/master/packages/babel/README_RU.md" target="_blank">Подробнее...</a>
***
*Для более подробного описания заходите по ссылкам каждого модуля.*

**Rockpack полностью бесплатный проект. Мы всегда открыты к коллаборации и контрибьютерам.**

## Альтернативы

Проект **Rockpack** вдохновлялся в разработке такими вещами как

- [Next.js](https://github.com/vercel/next.js/)
- [Creat React App](https://github.com/facebook/create-react-app)
- [Rome](https://github.com/romefrontend/rome)
- [Estrella](https://github.com/rsms/estrella)

## Зачем нам нужен Rockpack...?
...если есть **create-react-app** и другие альтернативы?
- **Rockpack** предоставляет очень легкий способ для старта проекта при помощи **@rockpack/starter**. Всего одна команда позволяет настроить каркас для вашего приложения с поддержкой TypeScript, Jest, Eslint, SSR и прочего.
- **Rockpack** очень гибок в использовании. Вы в праве проектировать архитектуру как вам угодно, использовать разные библиотеки и решения, например для стейт менеджмента.
- **Rockpack** не вносит какой либо магии. Это набор лучших практик и библиотек для автоматизации старта проекта.
- **Rockpack** имеет возможность помодульной интеграции в ранее созданный проект.
- **Rockpack** имеет возможность модифицировать webpack конфиг без "eject" с возможностью обновления **Rockpack**.
- **Rockpack** использует только существуюие модули и подходы и не создает велосипедов.

## Лицензия MIT

Copyright (c) Aleksandrov Sergey

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, а также лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:

ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ ГАРАНТИИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ, НО НЕ ОГРАНИЧИВАЯСЬ ИМИ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ТРЕБОВАНИЯМ, В ТОМ ЧИСЛЕ, ПРИ ДЕЙСТВИИ КОНТРАКТА, ДЕЛИКТЕ ИЛИ ИНОЙ СИТУАЦИИ, ВОЗНИКШИМ ИЗ-ЗА ИСПОЛЬЗОВАНИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫХ ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
