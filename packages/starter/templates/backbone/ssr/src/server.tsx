import { serverRender } from '@issr/core';
import Router from '@koa/router';
import { ChunkExtractor } from '@loadable/server';
import Koa, { Context } from 'koa';
import compress from 'koa-compress';
import serve from 'koa-static';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { constants } from 'node:zlib';
import PrettyError from 'pretty-error';
import { FilledContext, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import serialize from 'serialize-javascript';

import { routes } from './routes';
import { createServices } from './services';
import { createStore } from './store';
import './types/global.declaration';
import { isDevelopment } from './utils/environments';

const app = new Koa();
const router = new Router();
const pe = new PrettyError();

const publicFolder = path.resolve(__dirname, '../public');
const stats = JSON.parse(readFileSync(path.resolve(publicFolder, './stats.json'), 'utf8'));

function createFetchRequest(ctx: Context, req: Koa.Request): Request {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  ctx.res.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init = {
    body: req.method !== 'GET' && req.method !== 'HEAD' ? ctx.body : null,
    headers,
    method: req.method,
    signal: controller.signal,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return new Request(url.href, init);
}

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

router.get(/.*/, async (ctx: Context) => {
  const { dataRoutes, query } = createStaticHandler(routes);
  const fetchRequest = createFetchRequest(ctx, ctx.request);
  const context = await query(fetchRequest);

  const store = createStore({
    initialState: {},
    services: createServices(fetch),
  });

  const extractor = new ChunkExtractor({
    entrypoints: ['index'],
    stats,
  });

  const helmetContext = {} as FilledContext;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const router = createStaticRouter(dataRoutes, context);

  const { html } = await serverRender.string(() =>
    extractor.collectChunks(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error */}
          <StaticRouterProvider context={context} router={router} />
        </HelmetProvider>
      </Provider>,
    ),
  );

  const { helmet } = helmetContext;

  const scriptTags = extractor.getScriptTags();
  const linkTags = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  const reduxState = store.getState();

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
