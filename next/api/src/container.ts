import { Container } from 'inversify';

import { CommentControllerDIType, CommentController } from './controllers/comment';
import type { ICommentController } from './controllers/comment';
import { PostControllerDIType, PostController } from './controllers/post';
import type { IPostController } from './controllers/post';
import { UserControllerDIType, UserController } from './controllers/user';
import type { IUserController } from './controllers/user';
import { CommentRepositoryDIType, CommentRepository } from './repositories/comment';
import type { ICommentRepository } from './repositories/comment';
import { PostRepositoryDIType, PostRepository } from './repositories/post';
import type { IPostRepository } from './repositories/post';
import { UserRepositoryDIType, UserRepository } from './repositories/user';
import type { IUserRepository } from './repositories/user';
import { CommentServiceDIType, CommentService } from './services/comment';
import type { ICommentService } from './services/comment';
import { PostServiceDIType, PostService } from './services/post';
import type { IPostService } from './services/post';
import { UserServiceDIType, UserService } from './services/user';
import type { IUserService } from './services/user';

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
