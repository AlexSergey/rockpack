import { commentsService, ICommentsService } from './features/comments/service';
import { ILocalizationService, localizationService } from './features/localization/service';
import { IPostService, postService } from './features/post/service';
import { IPostsService, postsService } from './features/posts/service';
import { IUserService, userService } from './features/user/service';
import { IUsersService, usersService } from './features/users/service';
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
