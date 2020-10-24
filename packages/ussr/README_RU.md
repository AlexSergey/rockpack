# @rockpack/ussr (Universal Server-Side Rendering)

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">Readme (English version)</a>
</p>

**@rockpack/ussr** маленькая библиотека для создания SSR приложений. Universal в названии говорит о том, что Вы можете использовать её с любыми библиотеками и подходами для хранения состояния - Redux (thunk, sagas), Mobx, Apollo...

**@rockpack/ussr** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

Современные JS приложения делятся на 2 вида:
- CSR - Клиентский рендеринг. Приложение будет отображено только после скачивания и выполнения всего необходимого JS кода. До этого юзер будет видеть пустую страницу. Это ухудшает UX и плохо для SEO.
- SSR - Серверный рендеринг. Вспомогательный сервер отдает не пустую страницу, а страницу с данными. Таким образом пользоватеть сразу может начать работу с приложением а Вспомогательный сервер отдает не пустую страницу а страницу с данными. Пользоватеть сразу может начать работу с приложением а SEO боты проиндексируют страницу.

Существуют 2 проблемы при создании SSR приложений:

## Проблема Side effect'ов

Например, в блоге написанном на React, статьи подгружаются в приложение через асинхронный запрос на сервер. Статьи в данном случае это важная часть приложения для того, чтобы SEO бот провел качественную индексацию контента и чтобы пользователь сразу увидел содержимое страницы.
Эта асинхронная часть кода должна участвовать в SSR.
React из коробки может рендерить приложение на сервере, но без учета асинхронных операций.
**@rockpack/ussr** позволяет работать с асинхронным поведением во время SSR.

## Проблема компиляции

В production режиме нам нужно иметь артефакт для развертывания. Для этих целей нам нужно собрать как клиент часть такого приложения так и бекенд.

Схематично это выглядит так:

![Rockpack USSR](https://www.rockpack.io/readme_assets/rockpack_ussr_1.png)

- SSR приложение состоит из двух под-приложений - frontend, backend с общей логикой.
- NodeJS приложение выполняет React приложение.
- **@rockpack/ussr** обрабатывает все асинхронные операции.
- После получения данных из асинхронных операций производится рендер React приложения.
- NodeJS приложение отдает HTML пользователю.

Вышеописанное приложение собрано при помощи **@rockpack/compiler** как минфицированные NodeJS и React приложения.

Все вышеописанное позволяет организовать **@rockpack/compiler** и **@rockpack/ussr**

**@rockpack/ussr** это модуль является частью проекта **Rockpack** о котором можно прочитать <a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md" target="_blank">здесь</a>

## Использование

Простейший пример SSR приложения с использованием асинхронной функции через setState

Пример:
Есть простейшее приложение без SSR:

```jsx
import React, { render, useState, useEffect } from 'react';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

export const App = () => {
  const [state, setState] = useState({ text: 'text here' });

  useEffect(() => {
    asyncFn()
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

**Сделаем это приложение SSR:**

1. Установка:

```sh
# NPM
npm install @rockpack/ussr --save
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/ussr
yarn add @rockpack/compiler --dev
```

2. Создать файл *build.js* в корне приложения

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

Наша задача создать 2 приложения **client** и **server** с общей логикой.

3. Отделим общую логику от render. Создадим **App.jsx**, и вынесем общую часть как для Frontend так и для Backend:

```jsx
import React from 'react';
import { useUssrState, useUssrEffect } from '@rockpack/ussr';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'text here' });

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};
```

В данном коде *asyncFn* это асинхронная операция, которая эмулирует обращение на сервер.

 - *useUssrState* - аналог useState только с поддержкой SSR

 - *useUssrEffect* - аналог useEffect(() => {}, []); для SSR. Работает с асинхронной логикой.

4. **client.jsx** должен содержать часть приложения для frontend

```jsx
import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { App } from './App';

const [Ussr] = createUssr(window.USSR_DATA);

hydrate(
  <Ussr>
    <App />
  </Ussr>,
  document.getElementById('root')
);
```

Код
```js
const [Ussr] = createUssr(window.USSR_DATA);
```
Связывает состояние выполненное на сервере с приложением на клиенте. Для корректной работы *useUssrState* на клиенте

5. **server.jsx** должен содержать логику NodeJS приложения, для этого удобно использовать фреймверк koa/express или подобные:

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
Сервер должен отдавать папку в которую происходит сборка **frontendCompiler**

5.2
```html
<script>
  window.USSR_DATA = ${serialize(state, { isJSON: true })}
</script>
```

Этот код сохраняет выполненное состояние на сервере для последующего продолжения работы с ним на клиенте.

***

**В папке "examples" находится больше примеров** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/examples" target="_blank">here</a>

***

## Лицензия MIT

<a href="https://github.com/AlexSergey/rockpack/blob/master/README_RU.md#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-mit" target="_blank">MIT</a>
