import { ThunkDispatch } from '@reduxjs/toolkit';
import { History } from 'history';
import { Action } from 'redux';

import { IServices } from '../services';

import { IImageState } from './image';

export type Dispatcher = ThunkDispatch<IRootState, IThunkExtras, Action>;

export interface IThunkExtras {
  services: IServices;
  history: History;
}

export interface IStoreProps extends IThunkExtras {
  initialState?: {
    [key: string]: unknown;
  };
}

export interface IRootState {
  image: IImageState;
}
