import { commentsService, CommentsService } from './features/comments/service';
import { LocalizationService, localizationService } from './features/localization/service';
import { PostService, postService } from './features/post/service';
import { PostsService, postsService } from './features/posts/service';
import { UserService, userService } from './features/user/service';
import { UsersService, usersService } from './features/users/service';
import { Rest } from './utils/rest';

export interface Services {
  comments: CommentsService;
  localization: LocalizationService;
  post: PostService;
  posts: PostsService;
  user: UserService;
  users: UsersService;
}

export const createServices = (rest: Rest): Services => ({
  comments: commentsService(rest),
  localization: localizationService(rest),
  post: postService(rest),
  posts: postsService(rest),
  user: userService(rest),
  users: usersService(rest),
});
