import { serverRender } from '@issr/core';
import Router from '@koa/router';
import { createHead, UnheadProvider } from '@unhead/react/client';
import { transformHtmlTemplate } from '@unhead/react/server';
import Koa, { Context } from 'koa';
import serve from 'koa-static';
import path from 'node:path';
import serialize from 'serialize-javascript';

import { App } from './app';

const app = new Koa();
const router = new Router();

const getTemplate = (): string => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="/css/styles.css" />
    <script><!--app-state--></script>
</head>
<body>
    <div id="root"><!--app-html--></div>
    <script src="/index.js"></script>
</body>
</html>
`;

app.use(serve(path.resolve(__dirname, '../public')));

router.get(/.*/, async (ctx: Context) => {
  const head = createHead();
  const rendered = await serverRender.string(() => (
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
  ));

  const template = getTemplate();

  ctx.body = await transformHtmlTemplate(
    head,
    template
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace('<!--app-state-->', `window.SSR_DATA = ${serialize(rendered.state, { isJSON: true })}`),
  );
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening ${4000} port`);
});
