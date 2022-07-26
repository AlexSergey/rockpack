import { mockCommentsService } from '../features/comments/service.mock';
import { mockLocalizationService } from '../features/localization/service.mock';
import { mockPostService } from '../features/post/service.mock';
import { mockPostsService } from '../features/posts/service.mock';
import { mockUserService } from '../features/user/service.mock';
import { mockUsersService } from '../features/users/service.mock';
import { IServices } from '../services';

export const createMockServices = (): IServices => ({
  comments: mockCommentsService(),
  localization: mockLocalizationService(),
  post: mockPostService(),
  posts: mockPostsService(),
  user: mockUserService(),
  users: mockUsersService(),
});
