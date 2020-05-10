import Koa from 'koa';
import path from 'path';
import cors from '@koa/cors';
import serve from 'koa-static';
import logHandler from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import logger from '../logger';
import { routes } from '../routes';

import { errorsHandler } from '../errors';

const publicFolder = path.resolve(__dirname, '../public');

const app = new Koa();

app.use(errorsHandler());

app.use(logHandler({
  transporter: (str) => {
    logger.info(str);
  }
}));

app.use(
  cors({
    origins: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
  })
);

app.use(serve(publicFolder));
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
