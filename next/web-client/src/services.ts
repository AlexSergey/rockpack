import { commentsService, CommentsServiceInterface } from './features/Comments/service';
import { localizationService, LocalizationServiceInterface } from './features/Localization/service';
import { postService, PostServiceInterface } from './features/Post/service';
import { postsService, PostsServiceInterface } from './features/Posts/service';
import { userService, UserServiceInterface } from './features/User/service';
import { usersService, UsersServiceInterface } from './features/Users/service';
import { RestInterface } from './utils/rest';

export interface ServicesInterface {
  comments: CommentsServiceInterface;
  localization: LocalizationServiceInterface;
  post: PostServiceInterface;
  posts: PostsServiceInterface;
  user: UserServiceInterface;
  users: UsersServiceInterface;
}

export const createServices = (rest: RestInterface): ServicesInterface => ({
  comments: commentsService(rest),
  localization: localizationService(rest),
  post: postService(rest),
  posts: postsService(rest),
  user: userService(rest),
  users: usersService(rest),
});
