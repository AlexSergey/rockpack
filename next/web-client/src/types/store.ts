import { LoggerInterface } from 'logrock';
import { Localization } from './Localization';
import { PostsState } from './Posts';
import { PostState } from './Post';
import { User } from './User';
import { UsersState } from './Users';
import { CommentsState } from './Comments';
import { ServicesInterface } from '../services';

export interface ThunkExtras {
  logger: LoggerInterface;
  services: ServicesInterface;
}

export interface StoreProps extends ThunkExtras {
  initialState?: {
    [key: string]: unknown;
  };
  testMode?: boolean;
}

export interface RootState {
  user: User;
  localization: Localization;
  posts: PostsState;
  comments: CommentsState;
  post: PostState;
  users: UsersState;
  pagination: {
    current: number;
    count: number;
  };
}
