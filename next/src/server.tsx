import 'source-map-support/register';
import { readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import PrettyError from 'pretty-error';
import { StaticRouter } from 'react-router';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import { serverRender } from '@rock/ussr';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { ChunkExtractor } from '@loadable/server';
import serialize from 'serialize-javascript';
import { App } from './App';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();
const isProduction = process.env.NODE_ENV === 'production';
const publicFolder = path.resolve(__dirname, '../public');

const stats = JSON.parse(
  readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8')
);

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const routerParams = {
    location: ctx.request.url,
    context: {}
  };

  const css = new Set();

  const insertCss = isProduction ?
    (): void => {} :
    (...styles): void => styles.forEach(style => css.add(style._getCss()));

  const metaTagsInstance = MetaTagsServer();

  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index']
  });

  const { html, state } = await serverRender({
    render: () => (
      extractor.collectChunks(
        <StyleContext.Provider value={{ insertCss }}>
          <MetaTagsContext extract={metaTagsInstance.extract}>
            <StaticRouter {...routerParams}>
              <App />
            </StaticRouter>
          </MetaTagsContext>
        </StyleContext.Provider>
      )
    )
  });
  const meta = metaTagsInstance.renderToString();
  const scriptTags = extractor.getScriptTags();

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    ${meta}
    ${isProduction ? [
    `<style>${[...css].join('')}</style>`,
    '<link rel="stylesheet" type="text/css" href="/css/styles.css" />'
  ].join('') : [
    '<link rel="preload" as="style" href="/css/styles.css" />',
    '<link rel="preload" as="style" href="/css/1.css" />',
    '<link rel="stylesheet" type="text/css" href="/css/styles.css" />',
    '<link rel="stylesheet" type="text/css" href="/css/1.css" />'
  ].join('')}
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    ${scriptTags}
    ${!isProduction ? `<script src="http://localhost:${process.env.__LIVE_RELOAD__}/livereload.js"></script>` : ''}
</body>
</html>
`;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening ${4000} port`);
});

const handleError = (err, ctx): void => {
  if (ctx == null) {
    // eslint-disable-next-line no-console
    console.error('Unhandled exception occurred');
  }
};

const terminate = async (signal): Promise<void> => {
  server.close();
  process.exit(signal);
};

server.once('error', handleError);

['unhandledRejection', 'uncaughtException'].forEach((error: NodeJS.Signals) => {
  process.on(error, (e) => {
    // eslint-disable-next-line no-console
    console.log(pe.render(e));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal: NodeJS.Signals) => {
  process.once(signal, () => terminate(signal));
});
