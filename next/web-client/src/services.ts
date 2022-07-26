import { commentsService, ICommentsService } from './features/comments/service';
import { localizationService, ILocalizationService } from './features/localization/service';
import { postService, IPostService } from './features/post/service';
import { postsService, IPostsService } from './features/posts/service';
import { userService, IUserService } from './features/user/service';
import { usersService, IUsersService } from './features/users/service';
import { IRest } from './utils/rest';

export interface IServices {
  comments: ICommentsService;
  localization: ILocalizationService;
  post: IPostService;
  posts: IPostsService;
  user: IUserService;
  users: IUsersService;
}

export const createServices = (rest: IRest): IServices => ({
  comments: commentsService(rest),
  localization: localizationService(rest),
  post: postService(rest),
  posts: postsService(rest),
  user: userService(rest),
  users: usersService(rest),
});
