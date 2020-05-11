import Router from '@koa/router';
import { BadRequest } from './errors';

const router = new Router();

export const routes = (app): void => {
  router.get('/', async (ctx) => {
    ctx.body = 'hello world';
  });

  router.get('/error', async () => {
    throw new BadRequest();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async (ctx) => {
    ctx.body = 'Invalid URL!!!';
  });
};
