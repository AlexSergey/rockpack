import path from 'path';
import { readFileSync } from 'fs';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import PrettyError from 'pretty-error';
import Router from '@koa/router';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import { serverRender } from '@issr/core';
import { isDevelopment } from './utils/environments';
import App from './App';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();

const publicFolder = path.resolve(__dirname, '../public');
const stats = JSON.parse(
  readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8'),
);

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index'],
  });

  const { html, state } = await serverRender(() => (
    extractor.collectChunks(
      <App />,
    )
  ));

  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  /* eslint-disable */
  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    ${linkTags}
    ${styleTags}
    ${isDevelopment() ? <script src="/dev-server.js"></script> : ''}
    <script>
      window.SSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    ${scriptTags}
</body>
</html>
`;
  /* eslint-enable */
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening ${process.env.PORT} port`);
});

const handleError = (err, ctx) => {
  if (ctx == null) {
    // eslint-disable-next-line no-console
    console.error(pe.render(err));
  }
};

const terminate = async (signal) => {
  server.close();
  process.exit(signal);
};

server.once('error', handleError);

['unhandledRejection', 'uncaughtException'].forEach((error) => {
  process.on(error, (e) => {
    // eslint-disable-next-line no-console
    console.error(pe.render(e));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal) => {
  process.once((signal), () => terminate(signal));
});
