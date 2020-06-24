import { Container } from 'inversify';

import {
  CommentRepositoryInterface,
  CommentRepositoryDIType,
  CommentRepository
} from './repositories/Comment';
import {
  PostRepositoryInterface,
  PostRepositoryDIType,
  PostRepository
} from './repositories/Post';
import {
  UserRepositoryInterface,
  UserRepositoryDIType,
  UserRepository
} from './repositories/User';
import {
  CommentServiceInterface,
  CommentServiceDIType,
  CommentService
} from './services/Comment';
import {
  PostServiceInterface,
  PostServiceDIType,
  PostService
} from './services/Post';
import {
  UserServiceInterface,
  UserServiceDIType,
  UserService
} from './services/User';
import {
  CommentControllerInterface,
  CommentControllerDIType,
  CommentController
} from './controllers/Comment';
import {
  PostControllerInterface,
  PostControllerDIType,
  PostController
} from './controllers/Post';
import {
  UserControllerInterface,
  UserControllerDIType,
  UserController
} from './controllers/User';

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
