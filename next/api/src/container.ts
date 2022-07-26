import { Container } from 'inversify';

import { CommentControllerDIType, CommentController } from './controllers/Comment';
import type { ICommentController } from './controllers/Comment';
import { PostControllerDIType, PostController } from './controllers/Post';
import type { IPostController } from './controllers/Post';
import { UserControllerDIType, UserController } from './controllers/User';
import type { IUserController } from './controllers/User';
import { CommentRepositoryDIType, CommentRepository } from './repositories/Comment';
import type { ICommentRepository } from './repositories/Comment';
import { PostRepositoryDIType, PostRepository } from './repositories/Post';
import type { IPostRepository } from './repositories/Post';
import { UserRepositoryDIType, UserRepository } from './repositories/User';
import type { IUserRepository } from './repositories/User';
import { CommentServiceDIType, CommentService } from './services/Comment';
import type { ICommentService } from './services/Comment';
import { PostServiceDIType, PostService } from './services/Post';
import type { IPostService } from './services/Post';
import { UserServiceDIType, UserService } from './services/User';
import type { IUserService } from './services/User';

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
