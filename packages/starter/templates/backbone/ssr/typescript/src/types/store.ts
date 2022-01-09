import { Action } from 'redux';
import { History } from 'history';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ServicesInterface } from '../services';
import { ImageState } from './Image';

export type Dispatcher = ThunkDispatch<RootState, ThunkExtras, Action>;

export interface ThunkExtras {
  services: ServicesInterface;
}

export interface StoreProps extends ThunkExtras {
  initialState?: {
    [key: string]: unknown;
  };
  history: History;
  services: ServicesInterface;
}

export interface RootState {
  image: ImageState;
}
