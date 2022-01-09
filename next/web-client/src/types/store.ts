import { Action } from 'redux';
import { History } from 'history';
import { LoggerInterface } from 'logrock';
import { ThunkDispatch } from '@reduxjs/toolkit';
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
  history: History;
}

export type Dispatcher = ThunkDispatch<RootState, ThunkExtras, Action>;

export interface StoreProps extends ThunkExtras {
  initialState?: {
    [key: string]: unknown;
  };
  history: History;
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
