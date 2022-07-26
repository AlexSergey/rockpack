import path from 'node:path';

import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logHandler from 'koa-logger';
import mount from 'koa-mount';
import serve from 'koa-static';

import { config } from '../config';
import { errorsHandler } from '../errors';
import { logger } from '../logger';
import { routes } from '../routes';

const storageFolder = path.resolve(path.resolve('./'), config.storage);

const app = new Koa();

app.use(errorsHandler());

app.use(
  logHandler({
    transporter: (str) => {
      logger.info(str);
    },
  }),
);

app.use(
  cors({
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
    origins: '*',
  }),
);

app.use(mount('/storage', serve(storageFolder)));

app.use(
  bodyParser({
    onerror: (error, ctx) => {
      logger.warn({ ctx, error }, 'Parsing error');
      ctx.throw('body parse error', 422);
    },
  }),
);

routes(app);

export { app };
