import { Container, Injectable } from 'friendly-di';

import { CommentController } from './controllers/comment';
import { PostController } from './controllers/post';
import { UserController } from './controllers/user';
import { CommentRepository } from './repositories/comment';
import { PostRepository } from './repositories/post';
import { UserRepository } from './repositories/user';
import { CommentService } from './services/comment';
import { PostService } from './services/post';
import { UserService } from './services/user';

@Injectable()
class CompositionRoot {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private commentRepository: CommentRepository,
    private userController: UserController,
    private postController: PostController,
    private commentController: CommentController,
  ) {}

  getCommentController(): CommentController {
    return this.commentController;
  }

  getCommentRepository(): CommentRepository {
    return this.commentRepository;
  }

  getCommentService(): CommentService {
    return this.commentService;
  }

  getPostController(): PostController {
    return this.postController;
  }

  getPostRepository(): PostRepository {
    return this.postRepository;
  }

  getPostService(): PostService {
    return this.postService;
  }

  getUserController(): UserController {
    return this.userController;
  }

  getUserRepository(): UserRepository {
    return this.userRepository;
  }

  getUserService(): UserService {
    return this.userService;
  }
}

const container = new Container(CompositionRoot).compile();

export { container };
