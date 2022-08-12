import { readFileSync } from 'node:fs';
import path from 'node:path';

import { serverRender } from '@issr/core';
import Router from '@koa/router';
import { ChunkExtractor } from '@loadable/server';
import { createMemoryHistory } from 'history';
import Koa from 'koa';
import serve from 'koa-static';
import fetch from 'node-fetch';
import PrettyError from 'pretty-error';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import serialize from 'serialize-javascript';

import { App } from './app';
import { createServices } from './services';
import { createStore } from './store';
import { isDevelopment } from './utils/environments';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();

const publicFolder = path.resolve(__dirname, '../public');
const stats = JSON.parse(readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8'));

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const store = createStore({
    history: createMemoryHistory(),
    initialState: {},
    services: createServices(fetch),
  });

  const extractor = new ChunkExtractor({
    entrypoints: ['index'],
    stats,
  });

  const helmetContext = {};

  const { html } = await serverRender(() =>
    extractor.collectChunks(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={ctx.request.url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </Provider>,
    ),
  );

  const { helmet } = helmetContext;

  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  const reduxState = store.getState();

  /* eslint-disable */
  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${linkTags}
    ${styleTags}
    ${isDevelopment() ? '<script src="/dev-server.js"></script>' : ""}
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
  /* eslint-enable */
});

app.use(router.routes()).use(router.allowedMethods());

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
  process.once(signal, () => terminate(signal));
});
