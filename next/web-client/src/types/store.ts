import { Logger } from '@rockpack/logger';
import { LocalizationState } from './Localization';
import { PostsState } from './Posts';
import { PostState } from './PostDetails';
import { UserState } from './AuthManager';

export interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  logger: Logger;
}

export interface RootState {
  localization: LocalizationState;
  posts: PostsState;
  post: PostState;
  user: UserState;
}
