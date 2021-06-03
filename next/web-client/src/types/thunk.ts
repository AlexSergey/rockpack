// eslint-disable-next-line import/no-extraneous-dependencies
import { ThunkAction } from 'redux-thunk';
import { LoggerInterface } from 'logrock';
import { History } from 'history';
import { Action } from '@reduxjs/toolkit';
import { ServicesInterface } from '../services';
import { RootState } from './store';

export type ThunkResult<R = void> = ThunkAction<Promise<R>, RootState, {
  history: History,
  services: ServicesInterface,
  logger: LoggerInterface
}, Action>;
