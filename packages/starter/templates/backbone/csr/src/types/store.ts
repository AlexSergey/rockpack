import { ThunkDispatch } from '@reduxjs/toolkit';
import { Action } from 'redux';

import { IServices } from '../services';
import { IImageState } from './image';

export type Dispatcher = ThunkDispatch<IRootState, IThunkExtras, Action>;

export interface IThunkExtras {
  services: IServices;
}

export interface IStoreProps extends IThunkExtras {
  initialState?: Record<string, unknown>;
}

export interface IRootState {
  image: IImageState;
}
