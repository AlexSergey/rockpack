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
import { LocalizationObserver } from '@rock/localazer';
import { googleFontsInstall } from './assets/fonts';
import { App } from './App';
import ru from './locales/ru.json';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();
const isProduction = process.env.NODE_ENV === 'production';
const publicFolder = path.resolve(__dirname, '../public');
const languages = { ru };

const stats = JSON.parse(
  readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8')
);

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  console.log(languages.ru);
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

  const { html, state } = await serverRender(() => (
    extractor.collectChunks(
      <StyleContext.Provider value={{ insertCss }}>
        <MetaTagsContext extract={metaTagsInstance.extract}>
          <StaticRouter {...routerParams}>
            <LocalizationObserver languages={languages} active="ru">
              <App />
            </LocalizationObserver>
          </StaticRouter>
        </MetaTagsContext>
      </StyleContext.Provider>
    )
  ));

  const meta = metaTagsInstance.renderToString();
  const scriptTags = extractor.getScriptTags();

  const styles = isProduction ? [
    '<link rel="preload" as="style" href="/css/styles.css" />',
    '<link rel="preload" as="style" href="/css/1.css" />',
    '<link rel="stylesheet" type="text/css" href="/css/styles.css" />',
    '<link rel="stylesheet" type="text/css" href="/css/1.css" />'
  ].join('') : [
    `<style>${[...css].join('')}</style>`,
    '<link rel="stylesheet" type="text/css" href="/css/styles.css" />'
  ].join('');

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    ${meta}
    ${googleFontsInstall()}
    ${styles}
</head>
<body>
    <div id="root">${html}</div>
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
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
