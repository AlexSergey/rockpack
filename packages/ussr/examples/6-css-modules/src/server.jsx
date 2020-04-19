import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { StaticRouter } from 'react-router';
import serialize from 'serialize-javascript';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import { App } from './App';
import { serverRender } from '../../../src';

const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, '../public')));

router.get('/*', async (ctx) => {
  const css = new Set();
  const insertCss = process.env.NODE_ENV === 'production' ?
    () => {} :
    (...styles) => styles.forEach(style => css.add(style._getCss()));
  const { url } = ctx.request;
  const routerParams = {
    location: url,
    context: {}
  };
  const metaTagsInstance = MetaTagsServer();
  
  const { html, state } = await serverRender({
    render: () => (
      <StyleContext.Provider value={{ insertCss }}>
        <MetaTagsContext extract={metaTagsInstance.extract}>
          <StaticRouter {...routerParams}>
            <App />
          </StaticRouter>
        </MetaTagsContext>
      </StyleContext.Provider>
    )
  });
  const meta = metaTagsInstance.renderToString();
  
  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    ${meta}
    ${process.env.NODE_ENV === 'production' ?
    '<link rel="stylesheet" type="text/css" href="/css/styles.css" />' :
    `<style>${[...css].join('')}</style>`}
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
