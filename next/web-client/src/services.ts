import { commentsService, ICommentsService } from './features/Comments/service';
import { localizationService, ILocalizationService } from './features/Localization/service';
import { postService, IPostService } from './features/Post/service';
import { postsService, IPostsService } from './features/Posts/service';
import { userService, IUserService } from './features/User/service';
import { usersService, IUsersService } from './features/Users/service';
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
