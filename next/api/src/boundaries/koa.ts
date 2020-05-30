import Koa from 'koa';
import path from 'path';
import cors from '@koa/cors';
import serve from 'koa-static';
import mount from 'koa-mount';
import logHandler from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import logger from '../logger';
import { routes } from '../routes';
import config from '../config';

import { errorsHandler } from '../errors';

const publicFolder = path.resolve(process.env.ROOT_DIRNAME, 'public');
const storageFolder = path.resolve(process.env.ROOT_DIRNAME, config.storage);

const app = new Koa();

app.use(errorsHandler());

app.use(logHandler({
  transporter: (str) => {
    logger.info(str);
  }
}));

app.use(
  cors({
    credentials: true,
    origins: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
  })
);

app.use(mount('/public', serve(publicFolder)));
app.use(mount('/storage', serve(storageFolder)));

app.use(
  bodyParser({
    onerror: (error, ctx) => {
      logger.warn({ error, ctx }, 'Parsing error');
      ctx.throw('body parse error', 422);
    }
  })
);

routes(app);

export default app;
