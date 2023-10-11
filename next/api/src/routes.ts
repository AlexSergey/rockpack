import Router from '@koa/router';
import Application from 'koa';

import type { ICommentController } from './controllers/comment';
import type { IPostController } from './controllers/post';
import type { IUserController } from './controllers/user';

import { config } from './config';
import { container } from './container';
import { CommentControllerDIType } from './controllers/comment';
import { PostControllerDIType } from './controllers/post';
import { UserControllerDIType } from './controllers/user';
import { NotFoundError } from './errors';
import { accessRoute } from './middlewares/access-route';
import { protectedRoute } from './middlewares/protected-route';
import { resizeImage } from './middlewares/resize-image';
import { upload } from './middlewares/upload';

const router = new Router();

export const routes = (app: Application): void => {
  const userController = container.get<IUserController>(UserControllerDIType);
  const postController = container.get<IPostController>(PostControllerDIType);
  const commentController = container.get<ICommentController>(CommentControllerDIType);

  router.post('/v1/users/signup', userController.signup);
  router.post('/v1/users/signin', userController.signin);
  router.get('/v1/users/signout', userController.signout);
  router.get('/v1/users/authorization', protectedRoute, userController.authorization);
  router.delete('/v1/users/:id', protectedRoute, accessRoute(config.roles.admin), userController.delete);
  router.get('/v1/users', protectedRoute, accessRoute(config.roles.admin), userController.userList);

  router.get('/v1/posts', postController.fetch);
  router.get('/v1/posts/:id', postController.details);
  router.post(
    '/v1/posts',
    protectedRoute,
    upload(
      'title',
      'text',
      {
        maxCount: config.files.preview,
        name: 'preview',
      },
      {
        maxCount: config.files.photos,
        name: 'photos',
      },
    ),
    resizeImage(
      {
        name: 'preview',
        resize: config.files.thumbnail.preview,
      },
      {
        name: 'photos',
        resize: config.files.thumbnail.photos,
      },
    ),
    postController.create,
  );
  router.delete('/v1/posts/:id', protectedRoute, postController.delete);
  router.put('/v1/posts/:id', protectedRoute, postController.update);

  router.get('/v1/comments/:postId', commentController.fetch);
  router.post('/v1/comments/:postId', protectedRoute, commentController.create);
  router.delete('/v1/comments/:id', protectedRoute, commentController.delete);
  router.put('/v1/comments/:id', protectedRoute, commentController.update);

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async () => {
    throw new NotFoundError();
  });
};
