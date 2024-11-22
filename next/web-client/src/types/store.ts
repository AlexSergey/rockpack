import { ThunkDispatch } from '@reduxjs/toolkit';
import { History } from 'history';
import { LoggerInterface } from 'logrock';
import { Action } from 'redux';

import { Services } from '../services';
import { CommentsState } from './comments';
import { Localization } from './localization';
import { PostState } from './post';
import { PostsState } from './posts';
import { User } from './user';
import { IUsersState } from './users';

export type Dispatcher = ThunkDispatch<RootState, ThunkExtras, Action>;

export interface RootState {
  comments: CommentsState;
  localization: Localization;
  pagination: {
    count: number;
    current: number;
  };
  post: PostState;
  posts: PostsState;
  user: User;
  users: IUsersState;
}

export interface StoreProps extends ThunkExtras {
  history: History;
  initialState?: Record<string, unknown>;
  testMode?: boolean;
}

export interface ThunkExtras {
  history: History;
  logger: LoggerInterface;
  services: Services;
}
