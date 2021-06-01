import { LoggerInterface } from 'logrock';
import { History } from 'history';
import { Localization } from './Localization';
import { PostsState } from './Posts';
import { PostState } from './Post';
import { User } from './User';
import { UsersState } from './Users';
import { CommentsState } from './Comments';
import { ServicesInterface } from '../services';

export interface StoreProps {
  initialState?: {
    [key: string]: unknown;
  };
  logger: LoggerInterface;
  testMode?: boolean;
  history: History;
  services: ServicesInterface;
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
