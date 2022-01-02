import './types/global';
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import fetch from 'node-fetch';
import Router from '@koa/router';
import { readFileSync } from 'fs';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import serialize from 'serialize-javascript';
import { serverRender } from '@issr/core';
import { ChunkExtractor } from '@loadable/server';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { isDevelopment } from './utils/environments';
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

app.use(serve(publicFolder));

router.get('/*', async (ctx) => {
  const store = createStore({
    initialState: {},
    services: createServices(fetch),
  });

  const extractor = new ChunkExtractor({
    stats,
    entrypoints: ['index'],
  });

  const helmetContext = {} as FilledContext;

  const { html } = await serverRender(() => (
    extractor.collectChunks(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={ctx.request.url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </Provider>,
    )
  ));

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
    ${isDevelopment() ? '<script src="/dev-server.js"></script>' : ''}
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
