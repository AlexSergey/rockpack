import Router from '@koa/router';
import { BadRequest, NotFound } from './errors';

import { protectedRoute } from './utils/protectedRoute';
import { UserController } from './controllers/User';

const router = new Router();

export const routes = (app): void => {
  router.post('/signup', UserController.signup);

  router.post('/signin', UserController.signin);

  router.get('/posts', () => {});
  router.post('/posts', protectedRoute, () => {
  });
  router.delete('/posts/:id', protectedRoute, () => {
  });
  router.put('/posts/:id', protectedRoute, () => {
  });

  router.get('/checkToken', protectedRoute, UserController.checkToken);

  router.post('/error', async () => {
    throw new BadRequest();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async () => {
    throw new NotFound();
  });
};
