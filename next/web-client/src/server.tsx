import './types/global.declaration';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { serverRender } from '@issr/core';
import Router from '@koa/router';
import { ChunkExtractor } from '@loadable/server';
import { getDefaultLocale } from '@localazer/component';
import { createMemoryHistory } from 'history';
import Koa from 'koa';
import noCache from 'koa-no-cache';
import serve from 'koa-static';
import logger from 'logrock';
import PrettyError from 'pretty-error';
import React from 'react';
import { MetaTagsContext } from 'react-meta-tags';
import MetaTagsServer from 'react-meta-tags/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import serialize from 'serialize-javascript';

import { App } from './app';
import { googleFontsInstall } from './assets/fonts';
import { LocalizationContainer, getCurrentLanguageFromURL } from './features/localization';
import ru from './locales/ru.json';
import { createServices } from './services';
import { createStore } from './store';
import { isDevelopment } from './utils/environments';
import { createRestClient } from './utils/rest';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();
const publicFolder = path.resolve(__dirname, '../public');
const languages = { ru };

const stats = JSON.parse(readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8'));

app.use(
  noCache({
    global: true,
  }),
);

app.use(serve(publicFolder));

router.get('(.*)', async (ctx) => {
  const page = Number(ctx.request.query.page) || 1;
  const getToken = (): string | undefined => ctx.cookies.get('token');
  const currentLanguage = getCurrentLanguageFromURL(ctx.request.url, ctx.acceptsLanguages.bind(ctx));
  const locale = typeof languages[currentLanguage] === 'object' ? languages[currentLanguage] : getDefaultLocale();

  const rest = createRestClient(getToken);

  const store = createStore({
    history: createMemoryHistory(),
    initialState: {
      localization: {
        currentLanguage,
        languages: {
          [currentLanguage]: locale,
        },
      },
      pagination: {
        current: page,
      },
    },
    logger,
    services: createServices(rest),
  });

  const metaTagsInstance = MetaTagsServer();

  const extractor = new ChunkExtractor({
    entrypoints: ['index'],
    stats,
  });

  const { html } = await serverRender(() =>
    extractor.collectChunks(
      <Provider store={store}>
        <MetaTagsContext extract={metaTagsInstance.extract}>
          <StaticRouter location={ctx.request.url}>
            <LocalizationContainer>
              <App />
            </LocalizationContainer>
          </StaticRouter>
        </MetaTagsContext>
      </Provider>,
    ),
  );

  const meta = metaTagsInstance.renderToString();
  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  const reduxState = store.getState();

  ctx.type = 'html';
  /* eslint-disable */
  ctx.body = `
  <!DOCTYPE html>
<html lang="${currentLanguage === 'ru' ? 'ru-RU' : 'en-US'}">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">
    <meta name="viewport" content="width=device-width">
    <link rel="alternate" hreflang="ru-Ru" href=${process.env.URL}/ru/ />
    <link rel="alternate" hreflang="en-En" href=${process.env.URL}/en/ />
    ${meta}
    ${googleFontsInstall()}
    ${linkTags}
    ${styleTags}
</head>
<body>
    <div id="root">${html}</div>
    <script>
      window.REDUX_DATA = ${serialize(reduxState, { isJSON: true })}
    </script>
    ${scriptTags}

    ${isDevelopment() ? '<script src="/dev-server.js"></script>' : ''}
</body>
</html>
`;
  /* eslint-enable */
});

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on http://localhost:${process.env.PORT} port`);
});

const handleError = (err, ctx): void => {
  if (ctx == null) {
    // eslint-disable-next-line no-console
    console.error(pe.render(err));
  }
};

const terminate = async (): Promise<void> => {
  server.close();
  process.exit(1);
};

server.once('error', handleError);

['unhandledRejection', 'uncaughtException'].forEach((error: NodeJS.Signals) => {
  process.on(error, (e) => {
    // eslint-disable-next-line no-console
    console.error(pe.render(e));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal: NodeJS.Signals) => {
  process.once(signal, () => terminate());
});
