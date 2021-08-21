import { Container } from 'inversify';

import {
  CommentRepositoryDIType,
  CommentRepository
} from './repositories/Comment';
import type { CommentRepositoryInterface } from './repositories/Comment';
import {
  PostRepositoryDIType,
  PostRepository
} from './repositories/Post';
import type { PostRepositoryInterface } from './repositories/Post';
import {
  UserRepositoryDIType,
  UserRepository
} from './repositories/User';
import type { UserRepositoryInterface } from './repositories/User';
import {
  CommentServiceDIType,
  CommentService
} from './services/Comment';
import type { CommentServiceInterface } from './services/Comment';
import {
  PostServiceDIType,
  PostService
} from './services/Post';
import type { PostServiceInterface } from './services/Post';
import {
  UserServiceDIType,
  UserService
} from './services/User';
import type { UserServiceInterface } from './services/User';
import {
  CommentControllerDIType,
  CommentController
} from './controllers/Comment';
import type { CommentControllerInterface } from './controllers/Comment';
import {
  PostControllerDIType,
  PostController
} from './controllers/Post';
import type { PostControllerInterface } from './controllers/Post';
import {
  UserControllerDIType,
  UserController
} from './controllers/User';
import type { UserControllerInterface } from './controllers/User';

const container = new Container();

container.bind<CommentRepositoryInterface>(CommentRepositoryDIType)
  .to(CommentRepository);
container.bind<PostRepositoryInterface>(PostRepositoryDIType)
  .to(PostRepository);
container.bind<UserRepositoryInterface>(UserRepositoryDIType)
  .to(UserRepository);

container.bind<CommentServiceInterface>(CommentServiceDIType)
  .to(CommentService);
container.bind<PostServiceInterface>(PostServiceDIType)
  .to(PostService);
container.bind<UserServiceInterface>(UserServiceDIType)
  .to(UserService);

container.bind<CommentControllerInterface>(CommentControllerDIType)
  .to(CommentController);
container.bind<PostControllerInterface>(PostControllerDIType)
  .to(PostController);
container.bind<UserControllerInterface>(UserControllerDIType)
  .to(UserController);

export { container };
