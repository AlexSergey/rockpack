import { Container } from 'inversify';

import type { CommentControllerInterface } from './controllers/comment';
import type { PostControllerInterface } from './controllers/post';
import type { UserControllerInterface } from './controllers/user';
import type { CommentRepositoryInterface } from './repositories/comment';
import type { PostRepositoryInterface } from './repositories/post';
import type { UserRepositoryInterface } from './repositories/user';
import type { CommentServiceInterface } from './services/comment';
import type { PostServiceInterface } from './services/post';
import type { UserServiceInterface } from './services/user';

import { CommentController, CommentControllerDIType } from './controllers/comment';
import { PostController, PostControllerDIType } from './controllers/post';
import { UserController, UserControllerDIType } from './controllers/user';
import { CommentRepository, CommentRepositoryDIType } from './repositories/comment';
import { PostRepository, PostRepositoryDIType } from './repositories/post';
import { UserRepository, UserRepositoryDIType } from './repositories/user';
import { CommentService, CommentServiceDIType } from './services/comment';
import { PostService, PostServiceDIType } from './services/post';
import { UserService, UserServiceDIType } from './services/user';

const container = new Container();

container.bind<CommentRepositoryInterface>(CommentRepositoryDIType).to(CommentRepository);
container.bind<PostRepositoryInterface>(PostRepositoryDIType).to(PostRepository);
container.bind<UserRepositoryInterface>(UserRepositoryDIType).to(UserRepository);

container.bind<CommentServiceInterface>(CommentServiceDIType).to(CommentService);
container.bind<PostServiceInterface>(PostServiceDIType).to(PostService);
container.bind<UserServiceInterface>(UserServiceDIType).to(UserService);

container.bind<CommentControllerInterface>(CommentControllerDIType).to(CommentController);
container.bind<PostControllerInterface>(PostControllerDIType).to(PostController);
container.bind<UserControllerInterface>(UserControllerDIType).to(UserController);

export { container };
