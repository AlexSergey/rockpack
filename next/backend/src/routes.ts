import Router from '@koa/router';
import { BadRequest } from './errors';

import { UserController } from './controllers/User';

const router = new Router();

export const routes = (app): void => {
  router.get('/', UserController.createUser);

  router.get('/error', async () => {
    throw new BadRequest();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async (ctx) => {
    ctx.body = 'Invalid URL!!!';
  });
};
