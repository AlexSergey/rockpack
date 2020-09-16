<div style="text-align: center"><img style="width: 100%" src="https://www.rock-book.io/readme_assets/rockpack_logo.png"></div>

### Мотивация

Работая над многими проектами на React с нуля мы сталкиваемся с однотипными рутинными задачами. Мы каждый раз отвечаем на вопросы:

- *Как настроить эффективно билд систему с поддержкой множества необходимых нам форматов и Typescript?*
- *Какие правила выстроить для линтера, чтобы было комфортно работать?*
- *Как подружить Jest с нашей системой, чтобы он обрабатывал последний синтаксис Babel или Typescript?*
- *Как сделать серверный рендеринг правильно, чтобы он работал с готовыми решениями, такими как Redux или Apollo?*
- *Как настроить Webpack под сервер сайд рендеринг и иметь на выходе готовый артефакт для продакшена и отзывчивый дев сервер?*

Каждый раз на эти рутинные задачи мы тратим недели времени.

<div style="text-align: center"><img style="width: 100%" src="https://www.rock-book.io/readme_assets/rockpack_main_1.v2.png"></div>

Используя **Rockpack** вы сможете развернуть проект за считанные минуты и начать писать действительно полезный код.

<div style="text-align: center"><img style="width: 100%" src="https://www.rock-book.io/readme_assets/rockpack_main_1.2.png"></div>

Также на этапе старта проекта мы можем заложить такие фичи как - локализация, логирование и это мы можем сделать практически без затрат по времени.

### Что такое Rockpack

**Rockpack** это комплексное решение, которое позволяет нам экономить время на старте проекта и начать сразу решать боевые задачи, писать бизнес логику, а не в очередной раз иметь дело с рутиной, такой как настройки webpack и прочих вещей.

**Rockpack** был разработан с одной целью - использовать ранее созданные готовые решения максимально эффективно. В его разработке я старался избегать велосипедо строения, чтобы сделать данный инструмент максимально универсальным для каждого React проекта

### Обзор модулей Rockpack

**Rockpack** комплексное решение упрощающее разработку React проектов, рассмотрим модули по подробнее:

**@rockpack/compiler** - основной модуль системы, позволяющий компилировать ваше React приложение используя webpack, набор необходимых лодеров, плагинов и используя лучшие практики по настройки из коробки.
- С помощью данного модуля вы сможете
- Скомпилировать ваше React приложение
- Скомпилировать библиотеку как для React так и для vanilla JS
- Nodejs backend
- markup html files
- собрать изоморфное приложение
- Провести анализ бандла

<a href="https://github.com/AlexSergey/rock/blob/master/packages/compiler/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/ussr** - небольшая библиотека обеспечивающая SSR. Работает с Redux, Apollo и прочими решениями.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/ussr/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/tester** - полностью совместим с TS/Babel настроенный Jest, с множеством полезных дополнений.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/tester/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/codestyle** - эффективно настроенный Eslint с множеством best practice правил и дополнений.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/codestyle/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/logger** - это система логирования, которая будет выдавать отчет при возникновении ошибки в системе. Записываются все действия, которые совершал пользователь, нажатые кнопки, информация о ОС, дисплеи, браузере и прочем. Этот модуль позволяет понять причину возникновения ошибки.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/logger/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/localazer** - это система "правильной" локализации React приложения, которое поддерживает gettext для того, чтобы локализаторы могли в привычной среде.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/localazer/README.md" target="_blank">Подробнее...</a>
***

**@rockpack/babel** - вспомогательный модуль, babel preset.

<a href="https://github.com/AlexSergey/rock/blob/master/packages/babel/README.md" target="_blank">Подробнее...</a>
***

*Для более подробного описания заходите по ссылкам каждого модуля.*

**Rockpack полностью бесплатный проект. Мы всегда открыты к коллаборации и контрибьютерам.**

### Альтернативы

Проект **Rockpack** вдохновлялся в разработке такими вещами как

[Next.js](https://github.com/vercel/next.js/)
[Creat React App](https://github.com/facebook/create-react-app)
[Rome](https://github.com/romefrontend/rome)
[Estrella](https://github.com/rsms/estrella)

Отличительной особенностью **Rockpack** является то, что при создании приложения с его помощью можно выбирать только те инструменты которые нужны. **Rockpack** не вносит какой либо магии, это набор лучших практик и библиотек для автоматизации старта проекта. С таким подходом, **Rockpack** не является фреймверком, который диктует свои правила формирования архитектуры, **Rockpack** может работать с любыми фреймверками и не ограничивает подходы в проектировании архитектуры.

### MIT License

Copyright (c) Aleksandrov Sergey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
