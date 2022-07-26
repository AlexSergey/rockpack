import { mockCommentsService } from '../features/Comments/service.mock';
import { mockLocalizationService } from '../features/Localization/service.mock';
import { mockPostService } from '../features/Post/service.mock';
import { mockPostsService } from '../features/Posts/service.mock';
import { mockUserService } from '../features/User/service.mock';
import { mockUsersService } from '../features/Users/service.mock';
import { IServices } from '../services';

export const createMockServices = (): IServices => ({
  comments: mockCommentsService(),
  localization: mockLocalizationService(),
  post: mockPostService(),
  posts: mockPostsService(),
  user: mockUserService(),
  users: mockUsersService(),
});
