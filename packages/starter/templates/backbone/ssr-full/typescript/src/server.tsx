import './types/global';
import Koa from 'koa';
import path from 'path';
import React from 'react';
import serve from 'koa-static';
import fetch from 'node-fetch';
import Router from '@koa/router';
import { END } from 'redux-saga';
import { readFileSync } from 'fs';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import serialize from 'serialize-javascript';
import { serverRender } from '@rockpack/ussr';
import { createMemoryHistory } from 'history';
import { ChunkExtractor } from '@loadable/server';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { isProduction, isDevelopment } from './utils/environments';
import App from './App';
import createStore from './store';
import createServices from './services';

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

  const { store, rootSaga } = createStore({
    initState: {},
    history: createMemoryHistory(),
    services: createServices(fetch),
  });

  const insertCss = isProduction()
    ? (): void => {}
    // eslint-disable-next-line no-underscore-dangle
    : (...moduleStyles): void => moduleStyles.forEach((style) => css.add(style._getCss()));

  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index'],
  });

  const helmetContext = {} as FilledContext;

  const { html } = await serverRender(() => (
    extractor.collectChunks(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <StyleContext.Provider value={{ insertCss }}>
            <StaticRouter location={ctx.request.url} context={{}}>
              <App />
            </StaticRouter>
          </StyleContext.Provider>
        </HelmetProvider>
      </Provider>,
    )
  ), async () => {
    store.dispatch(END);
    await rootSaga.toPromise();
  });

  const { helmet } = helmetContext;

  const scriptTags = extractor.getScriptTags();

  if (isDevelopment()) {
    styles.push(`<style>${[...css].join('')}</style>`);
  }

  const reduxState = store.getState();

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${styles.join('')}
    ${isDevelopment()
    // eslint-disable-next-line no-underscore-dangle
    ? `<script src="http://localhost:${process.env.__LIVE_RELOAD__}/livereload.js"></script>`
    : ''}
</head>
<body>
    <div id="root">${html}</div>
    <script>
      window.REDUX_DATA = ${serialize(reduxState, { isJSON: true })}
    </script>
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

  if (isDevelopment()) {
    // eslint-disable-next-line no-underscore-dangle, no-console
    console.log(`LiveReload connected to ${process.env.__LIVE_RELOAD__} port`);
  }
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
