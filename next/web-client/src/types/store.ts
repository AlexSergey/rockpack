import { Logger } from '@rockpack/logger';
import { History } from 'history';
import { RouterState } from 'connected-react-router';
import { LocalizationState } from './Localization';
import { PostsState } from './Posts';
import { PostState } from './PostDetails';
import { AuthState } from './AuthManager';
import { User } from './Users';

export interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  logger: Logger;
  history: History;
  getToken: () => string | undefined;
}

export interface RootState {
  router: RouterState;
  localization: LocalizationState;
  posts: PostsState;
  post: PostState;
  comments: any;
  auth: AuthState;
  userStatistic: any;
  users: User[];
}
