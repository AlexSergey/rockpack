# @rockpack/ussr (Universal Server-Side Rendering)
<div style="text-align: right"><a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md">Readme (Russian version)</a></div>

**@rockpack/ussr** A small library for building SSR applications. Universal in the name says that you can use it with any libraries and approaches for storing state - Redux (thunk, sagas), Mobx, Apollo...

**@rockpack/ussr** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

Modern JS applications are divided into 2 types:
- CSR - Client-Side rendering. The application will be displayed only after downloading and executing all the necessary JS code. Until then, the user will see a blank page. It degrades the UX and is bad for SEO.
- SSR - Server-Side rendering. The auxiliary server doesn't send a blank page, but a page with data. Thus, the user can immediately start working with the application, and the Secondary Server does not give a blank page but a page with data. The user can immediately start working with the application and SEO bots will index the page.

There are 2 problems when building SSR applications

## Проблема Side effect'ов

Для организации кода нашего приложения нужно понимать, что запросы для получения данных нашим приложением - это асинхронные операции и они должны участвовать в SSR, так как они предоставляют пользователю и СЕО ботам необходимые данные.
Например, страничка с списком статей делает запрос на API для получения статей в последствии отображения их в нашем приложении. Такого рода Side effect'ы должны быть обработаны SSR библиотекой.
Side effect'ы могут быть зависимы друг от друга. Например при получении списка статей мы должны получить статистические данные по ним, чтобы отобразить это пользователям.
Также наше приложение должно обладать механизмом для того, чтобы прикрепить выполненный на стороне сервера объект состояния с клиентским приложением, чтобы пользователь мог продолжить работать с этим состоянием.

## Проблема компиляции

Для продакшен режима нам нужно иметь артефакт для деплоя. Для этих целей нам нужно собрать как клиент часть такого приложения так и бекенд.

Схематично это выглядит так:

<div style="text-align: center"><img style="width: 100%" src="https://www.rock-book.io/readme_assets/rockpack_ussr_1.png" /></div>

- NodeJS приложение выполняет React приложение
- React приложение выполняет все асинхронные операции
- После получения данных из асинхронных операций производится рендер
- NodeJS приложение отдает HTML пользователю

Вышеописанное приложение собрано при помощи **@rockpack/compiler** как минфицированные NodeJS и React приложения.

Все вышеописанное позволяет организовать **@rockpack/ussr** и **@rockpack/ussr**

**@rockpack/ussr** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Использование

Простейший пример SSR приложения с использованием асинхронной функции через setState

Пример:
Есть простейшее приложение без SSR:

```jsx
import React, { render, useState, useEffect } from 'react';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

export const App = () => {
  const [state, setState] = useState({ text: 'text here' });

  useEffect(() => {
    effect()
        .then(data => setState(data))
  }, []);

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};

render(
  <App />,
  document.getElementById('root')
);
```

Чтобы из этого приложения получить SSR, нужно:

1. Установка:

```sh
# NPM
npm install @rockpack/ussr --save
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/ussr
yarn add @rockpack/compiler --dev
```

2. Создать файл для компиляции приложения *build.js*

```js
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

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

3. App.jsx точка входа приложения, одинакова как для сервер кода так и для клиента

```jsx
import React from 'react';
import { useUssrState, useWillMount } from '@rockpack/ussr';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'text here' });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};
```

В данном коде effect это асинхронная операция, которая эмулирует обращение на сервер.

 *useUssrState* аналог useState только с поддержкой SSR

 *useWillMount* - аналог useEffect(() => {}, []); для SSR. Данная функция может работать как с promise, так и с другими видами асинхронности через передачу параметра:

```js
useWillMount(resolve => {
  setTimeout(() => {
    //async logic
    resolve();
  }, 1000);
});
```

4. client.js должен содержать часть приложения для frontend

```jsx
import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { App } from './App';

const [, Ussr] = createUssr(window.USSR_DATA);

hydrate(
  <Ussr>
    <App />
  </Ussr>,
  document.getElementById('root')
);
```

Код
```js
const [, Ussr] = createUssr(window.USSR_DATA);
```
Связывает состояние выполненное на сервере с приложением на клиенте. Для корректной работы *useUssrState* на клиенте

5. server.js должен содержать логику NodeJS приложения, для этого удобно использовать фреймверк koa/express или подобные:

```jsx
import React from 'react';
import express from 'express';
import { serverRender } from '@rockpack/ussr';
import serialize from 'serialize-javascript';
import { App } from './App';

const app = express();

app.use(express.static('public'));

app.get('/*', async (req, res) => {
  const { html, state } = await serverRender(() => <App />);

  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
</body>
</html>
`);
});

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
```
В данном коде есть 2 важных момента:
5.1
```js
app.use(express.static('public'));
```
должен расшаривать папку в которую происходит билд **frontendCompiler**

5.2
```html
<script>
  window.USSR_DATA = ${serialize(state, { isJSON: true })}
</script>
```

Этот код сохраняет выполненное состояние на сервере для последующего продолжения работы с ним на клиенте.

***

**Please see "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/examples" target="_blank">here</a>

***

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
