import Router from '@koa/router';
import { NotFound } from './errors';

import { protectedRoute } from './utils/protectedRoute';

import { UserController } from './controllers/User';
import { PostController } from './controllers/Post';

const router = new Router();

export const routes = (app): void => {
  router.post('/v1/users/signup', UserController.signup);
  router.post('/v1/users/signin', UserController.signin);
  router.get('/v1/users/signout', UserController.signout);
  router.get('/v1/users/check', protectedRoute, UserController.checkToken);

  router.get('/v1/posts', PostController.fetch);
  router.post('/v1/posts', protectedRoute, PostController.create);
  router.delete('/v1/posts/:id', protectedRoute, PostController.delete);
  router.put('/v1/posts/:id', protectedRoute, PostController.update);

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async () => {
    throw new NotFound();
  });
};
