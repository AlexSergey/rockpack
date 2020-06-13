import Router from '@koa/router';
import { NotFound } from './errors';
import { config } from './config';

import { protectedRoute } from './middlewares/protectedRoute';
import { accessRoute } from './middlewares/accessRoute';
import { upload } from './middlewares/upload';
import { resizeImage } from './middlewares/resizeImage';

import { UserController } from './controllers/User';
import { PostController } from './controllers/Post';
import { CommentController } from './controllers/Comment';

const router = new Router();

export const routes = (app): void => {
  router.post('/v1/users/signup', UserController.signup);
  router.post('/v1/users/signin', UserController.signin);
  router.get('/v1/users/signout', UserController.signout);
  router.get('/v1/users/authorization', protectedRoute, UserController.authorization);
  router.delete('/v1/users/:id', protectedRoute, accessRoute(config.roles.admin), UserController.delete);
  router.get('/v1/users/', protectedRoute, accessRoute(config.roles.admin), UserController.userList);

  router.get('/v1/posts', PostController.fetch);
  router.get('/v1/posts/:id', PostController.details);
  router.post('/v1/posts', protectedRoute, upload(
    'title',
    'text',
    {
      name: 'preview',
      maxCount: config.files.preview
    }, {
      name: 'photos',
      maxCount: config.files.photos
    }
  ), resizeImage({
    name: 'preview',
    resize: config.files.thumbnail.preview
  }, {
    name: 'photos',
    resize: config.files.thumbnail.photos
  }), PostController.create);
  router.delete('/v1/posts/:id', protectedRoute, PostController.delete);
  router.put('/v1/posts/:id', protectedRoute, PostController.update);

  router.get('/v1/comments/:postId', CommentController.fetch);
  router.post('/v1/comments/:postId', protectedRoute, CommentController.create);
  router.delete('/v1/comments/:id', protectedRoute, CommentController.delete);
  router.put('/v1/comments/:id', protectedRoute, CommentController.update);

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async () => {
    throw new NotFound();
  });
};
