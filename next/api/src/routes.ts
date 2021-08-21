import Application from 'koa';
import Router from '@koa/router';
import { NotFound } from './errors';
import { config } from './config';
import { container } from './container';

import { protectedRoute } from './middlewares/protectedRoute';
import { accessRoute } from './middlewares/accessRoute';
import { upload } from './middlewares/upload';
import { resizeImage } from './middlewares/resizeImage';

import { UserControllerDIType } from './controllers/User';
import type { UserControllerInterface } from './controllers/User';
import { PostControllerDIType } from './controllers/Post';
import type { PostControllerInterface } from './controllers/Post';
import { CommentControllerDIType } from './controllers/Comment';
import type { CommentControllerInterface } from './controllers/Comment';

const router = new Router();

export const routes = (app: Application): void => {
  const userController = container.get<UserControllerInterface>(UserControllerDIType);
  const postController = container.get<PostControllerInterface>(PostControllerDIType);
  const commentController = container.get<CommentControllerInterface>(CommentControllerDIType);

  router.post('/v1/users/signup', userController.signup);
  router.post('/v1/users/signin', userController.signin);
  router.get('/v1/users/signout', userController.signout);
  router.get('/v1/users/authorization', protectedRoute, userController.authorization);
  router.delete('/v1/users/:id', protectedRoute, accessRoute(config.roles.admin), userController.delete);
  router.get('/v1/users', protectedRoute, accessRoute(config.roles.admin), userController.userList);

  router.get('/v1/posts', postController.fetch);
  router.get('/v1/posts/:id', postController.details);
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
  }), postController.create);
  router.delete('/v1/posts/:id', protectedRoute, postController.delete);
  router.put('/v1/posts/:id', protectedRoute, postController.update);

  router.get('/v1/comments/:postId', commentController.fetch);
  router.post('/v1/comments/:postId', protectedRoute, commentController.create);
  router.delete('/v1/comments/:id', protectedRoute, commentController.delete);
  router.put('/v1/comments/:id', protectedRoute, commentController.update);

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async () => {
    throw new NotFound();
  });
};
