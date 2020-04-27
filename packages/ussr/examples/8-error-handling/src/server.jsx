import 'source-map-support/register';
import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import PrettyError from 'pretty-error';
import serialize from 'serialize-javascript';
import { App } from './App';
import { serverRender } from '../../../src';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();

app.use(serve(path.resolve(__dirname, '../public')));

router.get('/*', async (ctx) => {
  const { html, state } = await serverRender(() => <App />);
  ctx.body = `
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
`;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(4000, () => {
  console.log(`Server is listening ${4000} port`);
});

function handleError(err, ctx) {
  if (ctx == null) {
    console.error('Unhandled exception occurred');
  }
}

async function terminate(signal) {
  server.close();
  process.exit(signal);
}

server.once('error', handleError);

['unhandledRejection', 'uncaughtException'].forEach(error => {
  process.on(error, (error) => {
    console.log(pe.render(error));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
  process.once(signal, () => terminate(signal));
});
