# @rockpack/ussr (Universal Server-Side Rendering)

<p align="right">
  <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README_RU.md">Readme (Russian version)</a>
</p>

**@rockpack/ussr** A small library for building SSR applications. Universal in the name says that you can use it with any libraries and approaches for storing state - Redux (thunk, sagas), Mobx, Apollo...

**@rockpack/ussr** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

Modern JS applications are divided into 2 types:
- CSR - Client-Side rendering. The application will be displayed only after downloading and executing all the necessary JS code. Until then, the user will see a blank page. It degrades the UX and is bad for SEO.
- SSR - Server-Side rendering. The auxiliary server doesn't send a blank page, but a page with data. Thus, the user can immediately start working with the application, and the Secondary Server does not give a blank page but a page with data. The user can immediately start working with the application and SEO bots will index the page.

There are 2 problems when building SSR applications

## Side effect's issue

For example, in a blog written in React, articles are loaded into the application via an asynchronous request to the server. Articles, in this case, are an important part of the application for the SEO bot to perform high-quality content indexing and for the user to immediately see the page content.
This asynchronous piece of code must participate in the SSR.
React out of the box can render an application on the server, but without considering asynchronous operations.
**@rockpack/ussr** allows for asynchronous behavior during SSR.

## Compilation issue

In production mode, we need to have an artifact for deployment. For these purposes, we need to compile both the client and the backend of the application.

Schematically it looks like this:

![Rockpack USSR](https://www.rockpack.io/readme_assets/rockpack_ussr_1.png)

- SSR application consists of two sub-applications - frontend, backend with common logic.
- NodeJS app runs React app.
- **@rockpack/ussr** handles all asynchronous operations.
- After receiving data from asynchronous operations, the React application is rendered.
- NodeJS application serves HTML to the user.

The above application is compiled with **@rockpack/compiler** as minified NodeJS and React applications.

All of the above allows you to organize **@rockpack/compiler** and **@rockpack/ussr**.

**@rockpack/ussr** this module is part of the **Rockpack** project which you can read about <a href="https://github.com/AlexSergey/rockpack/blob/master/README.md" target="_blank">here</a>

## Using

The simplest example of an SSR application using an asynchronous function via setState

Example:
There is a simple application without SSR:

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

**Let's change this app to SSR:**

1. Installation:

```sh
# NPM
npm install @rockpack/ussr --save
npm install @rockpack/compiler --save-dev

# YARN
yarn add @rockpack/ussr
yarn add @rockpack/compiler --dev
```

2. Make *build.js* in the root of project

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
The main goal is to create 2 applications **client** and **server** with common logic.

3. Let's separate the general logic from render. Let's create **App.jsx**, and take out the common part for both Frontend and Backend:

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

In this code, *asyncFn* is an asynchronous operation that emulates a call to the server.

 - *useUssrState* is analogue of useState only with SSR support

 - *useUssrEffect* is analogue useEffect (() => {}, []); for SSR. It works with async logic.

4. **client.jsx** should contain part of the application for Frontend

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

The code:
```js
const [Ussr] = createUssr(window.USSR_DATA);
```
Associates the state executed on the server with the application on the client. For correct work *useUssrState* on the client

5. **server.jsx** should contain the logic of the NodeJS application, for this it is convenient to use the koa/express framework or similar:

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
There are 2 important points in this code:
5.1
```js
app.use(express.static('public'));
```
The server should serve the folder where the build **frontendCompiler** takes place

5.2
```html
<script>
  window.USSR_DATA = ${serialize(state, { isJSON: true })}
</script>
```

This code saves the executed state on the server for later continuation of work with it on the client.

***

**Please see "examples" folder** - <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/examples" target="_blank">here</a>

***

## The MIT License

<a href="https://github.com/AlexSergey/rockpack#the-mit-license" target="_blank">MIT</a>
