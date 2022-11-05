import './types/global.declaration';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { constants } from 'node:zlib';

import { serverRender } from '@issr/core';
import Router from '@koa/router';
import { ChunkExtractor } from '@loadable/server';
import { createMemoryHistory } from 'history';
import Koa, { Context } from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import fetch from 'node-fetch';
import PrettyError from 'pretty-error';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
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

app.use(
  compress({
    br: false,
    deflate: {
      flush: constants.Z_SYNC_FLUSH,
    },
    filter(contentType: string): boolean {
      return /text/i.test(contentType);
    },
    gzip: {
      flush: constants.Z_SYNC_FLUSH,
    },
    threshold: 2048,
  }),
);

app.use(serve(publicFolder));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  }
});

router.get('/*', async (ctx: Context) => {
  const store = createStore({
    history: createMemoryHistory(),
    initialState: {},
    services: createServices(fetch),
  });

  const extractor = new ChunkExtractor({
    entrypoints: ['index'],
    stats,
  });

  const helmetContext = {} as FilledContext;

  const { html } = await serverRender.string(() =>
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
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});

const handleError = (err: Error): void => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(pe.render(err));
  }
};

const terminate = async (): Promise<void> => {
  server.close();
  process.exit(1);
};

server.once('error', handleError);

['unhandledRejection', 'uncaughtException'].forEach((error: string) => {
  process.on(error, (e) => {
    // eslint-disable-next-line no-console
    console.error(pe.render(e));
  });
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal: string) => {
  process.once(signal, () => terminate());
});
