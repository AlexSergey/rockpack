import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import serialize from 'serialize-javascript';
import { serverRender } from '@rockpack/ussr';
import App from './App';

const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, '../public')));

router.get('/*', async (ctx) => {
  const { html, state } = await serverRender(() => (
    <App />
  ));

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    ${process.env.NODE_ENV === 'development' ?
      `<script src="http://localhost:${process.env.__LIVE_RELOAD__}/livereload.js"></script>` :
    ''}
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
</body>
</html>
`;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(4000, () => {
  console.log(`Server is listening ${4000} port`);

  if (process.env.NODE_ENV === 'development') {
    console.log(`LiveReload connected to ${process.env.__LIVE_RELOAD__} port`);
  }
});
