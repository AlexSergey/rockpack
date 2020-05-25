import 'source-map-support/register';
import 'regenerator-runtime/runtime.js';
import { readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from '@koa/router';
import PrettyError from 'pretty-error';
import { getDefaultLocale } from '@rockpack/localazer';
import { StaticRouter } from 'react-router';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import { Provider } from 'react-redux';
import { serverRender } from '@rockpack/ussr';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { ChunkExtractor } from '@loadable/server';
import serialize from 'serialize-javascript';
import { googleFontsInstall } from './assets/fonts';
import { App } from './main';
import { createStore } from './store';
import { logger } from './utils/logger';
import ru from './features/Localization/locales/ru.json';
import { LocalizationContainer, getCurrentLanguageFromURL } from './features/Localization';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();
const isProduction = process.env.NODE_ENV === 'production';
const publicFolder = path.resolve(__dirname, '../public');
const languages = { ru };

const stats = JSON.parse(
  readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8')
);

const styles = stats.assets
  .filter(file => path.extname(file.name) === '.css')
  .map(style => `<link rel="stylesheet" type="text/css" href="/${style.name}" />`);

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const currentLanguage = getCurrentLanguageFromURL(ctx.request.url, ctx.acceptsLanguages);
  const locale = typeof languages[currentLanguage] === 'object' ?
    languages[currentLanguage] :
    getDefaultLocale();

  const store = createStore({
    initState: {
      localization: {
        currentLanguage,
        locale
      }
    },
    logger
  });

  const routerParams = {
    location: ctx.request.url,
    context: {}
  };

  const css = new Set();

  const insertCss = isProduction ?
    (): void => {} :
    (...moduleStyles): void => moduleStyles.forEach(style => css.add(style._getCss()));

  const metaTagsInstance = MetaTagsServer();

  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index']
  });

  const { html, state } = await serverRender(() => (
    extractor.collectChunks(
      <Provider store={store}>
        <StyleContext.Provider value={{ insertCss }}>
          <MetaTagsContext extract={metaTagsInstance.extract}>
            <StaticRouter {...routerParams}>
              <LocalizationContainer>
                <App />
              </LocalizationContainer>
            </StaticRouter>
          </MetaTagsContext>
        </StyleContext.Provider>
      </Provider>
    )
  ));

  const meta = metaTagsInstance.renderToString();
  const scriptTags = extractor.getScriptTags();

  if (!isProduction) {
    styles.push(`<style>${[...css].join('')}</style>`);
  }

  const reduxState = store.getState();

  ctx.body = `
  <!DOCTYPE html>
<html lang="${currentLanguage === 'ru' ? 'ru-RU' : 'en-US'}">
<head>
    ${meta}
    ${googleFontsInstall()}
    ${styles.join('')}
</head>
<body>
    <div id="root">${html}</div>
    <script>
      window.REDUX_DATA = ${serialize(reduxState, { isJSON: true })}
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
