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
  logger: LoggerInterface;
  services: IServices;
  history: History;
}

export type Dispatcher = ThunkDispatch<IRootState, IThunkExtras, Action>;

export interface IStoreProps extends IThunkExtras {
  initialState?: {
    [key: string]: unknown;
  };
  history: History;
  testMode?: boolean;
}

export interface IRootState {
  user: IUser;
  localization: ILocalization;
  posts: IPostsState;
  comments: ICommentsState;
  post: IPostState;
  users: IUsersState;
  pagination: {
    current: number;
    count: number;
  };
}
