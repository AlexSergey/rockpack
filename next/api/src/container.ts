import { Container } from 'inversify';

import type { ICommentController } from './controllers/comment';
import type { IPostController } from './controllers/post';
import type { IUserController } from './controllers/user';
import type { ICommentRepository } from './repositories/comment';
import type { IPostRepository } from './repositories/post';
import type { IUserRepository } from './repositories/user';
import type { ICommentService } from './services/comment';
import type { IPostService } from './services/post';
import type { IUserService } from './services/user';

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

container.bind<ICommentRepository>(CommentRepositoryDIType).to(CommentRepository);
container.bind<IPostRepository>(PostRepositoryDIType).to(PostRepository);
container.bind<IUserRepository>(UserRepositoryDIType).to(UserRepository);

container.bind<ICommentService>(CommentServiceDIType).to(CommentService);
container.bind<IPostService>(PostServiceDIType).to(PostService);
container.bind<IUserService>(UserServiceDIType).to(UserService);

container.bind<ICommentController>(CommentControllerDIType).to(CommentController);
container.bind<IPostController>(PostControllerDIType).to(PostController);
container.bind<IUserController>(UserControllerDIType).to(UserController);

export { container };
