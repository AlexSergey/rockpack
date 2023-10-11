import { ThunkDispatch } from '@reduxjs/toolkit';
import { History } from 'history';
import { LoggerInterface } from 'logrock';
import { Action } from 'redux';

import { IServices } from '../services';
import { ICommentsState } from './comments';
import { ILocalization } from './localization';
import { IPostState } from './post';
import { IPostsState } from './posts';
import { IUser } from './user';
import { IUsersState } from './users';

export interface IThunkExtras {
  history: History;
  logger: LoggerInterface;
  services: IServices;
}

export type Dispatcher = ThunkDispatch<IRootState, IThunkExtras, Action>;

export interface IStoreProps extends IThunkExtras {
  history: History;
  initialState?: {
    [key: string]: unknown;
  };
  testMode?: boolean;
}

export interface IRootState {
  comments: ICommentsState;
  localization: ILocalization;
  pagination: {
    count: number;
    current: number;
  };
  post: IPostState;
  posts: IPostsState;
  user: IUser;
  users: IUsersState;
}
