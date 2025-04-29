import { serverRender } from '@issr/core';
import Router from '@koa/router';
import Koa from 'koa';
import serve from 'koa-static';
import path from 'node:path';
import serialize from 'serialize-javascript';

import { App } from './app';

const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, '../public')));

router.get(/.*/, async (ctx) => {
  const { html, state } = await serverRender.string(() => <App />);
  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="/css/styles.css" />
    <script>
      window.SSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
</body>
</html>
`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening ${4000} port`);
});
