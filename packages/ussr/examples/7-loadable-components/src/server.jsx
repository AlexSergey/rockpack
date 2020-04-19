import { readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { StaticRouter } from 'react-router';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';

import { App } from './App';
import { serverRender } from '../../../src';

const app = new Koa();
const router = new Router();

const currentFolder = path.basename(process.cwd());
const stats = JSON.parse(
  readFileSync(currentFolder === 'dist' ?
    path.resolve('./stats.json') :
    path.resolve('./dist/stats.json'),
  'utf8')
);

app.use(serve(path.resolve(__dirname, '../public')));

router.get('/*', async (ctx) => {
  const { url } = ctx.request;
  const routerParams = {
    location: url,
    context: {}
  };
  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index']
  });
  
  const { html, state } = await serverRender({
    render: () => (
      extractor.collectChunks(
        <StaticRouter {...routerParams}>
          <App />
        </StaticRouter>
      )
    )
  });
  const scriptTags = extractor.getScriptTags();
  
  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    ${scriptTags}
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
