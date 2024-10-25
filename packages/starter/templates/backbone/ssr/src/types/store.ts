import { ThunkDispatch } from '@reduxjs/toolkit';
import { Action } from 'redux';

import { Services } from '../services';
import { ImageState } from './image';

export type Dispatcher = ThunkDispatch<RootState, ThunkExtras, Action>;

export interface ThunkExtras {
  services: Services;
}

export interface StoreProps extends ThunkExtras {
  initialState?: Record<string, unknown>;
}

export interface RootState {
  image: ImageState;
}
