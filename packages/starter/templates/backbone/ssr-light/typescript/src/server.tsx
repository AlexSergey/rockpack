import './types/global';
import path from 'path';
import { readFileSync } from 'fs';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import PrettyError from 'pretty-error';
import Router from '@koa/router';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { serverRender } from '@rockpack/ussr';
import { isProduction, isDevelopment } from './utils/environments';
import App from './App';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();

const publicFolder = path.resolve(__dirname, '../public');
const stats = JSON.parse(
  readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8'),
);

const styles = stats.assets
  .filter((file) => path.extname(file.name) === '.css')
  .map((style) => `<link rel="stylesheet" type="text/css" href="/${style.name}" />`);

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const css = new Set();

  const insertCss = isProduction()
    ? (): void => {}
    // eslint-disable-next-line no-underscore-dangle
    : (...moduleStyles): void => moduleStyles.forEach((style) => css.add(style._getCss()));

  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index'],
  });

  const { html, state } = await serverRender(() => (
    extractor.collectChunks(
      <StyleContext.Provider value={{ insertCss }}>
        <App />
      </StyleContext.Provider>,
    )
  ));

  const scriptTags = extractor.getScriptTags();

  if (isDevelopment()) {
    styles.push(`<style>${[...css].join('')}</style>`);
  }

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    ${styles.join('')}
    ${isDevelopment() ? <script src="/dev-server.js"></script> : ''}
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    ${scriptTags}
</body>
</html>
`;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening ${process.env.PORT} port`);
});

const handleError = (err, ctx): void => {
  if (ctx == null) {
    // eslint-disable-next-line no-console
    console.error(pe.render(err));
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
    console.error(pe.render(e));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal: NodeJS.Signals) => {
  process.once((signal), () => terminate(signal));
});
