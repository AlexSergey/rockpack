// eslint-disable-next-line import/no-extraneous-dependencies
import { ThunkAction } from 'redux-thunk';
import { Action } from '@reduxjs/toolkit';
import { RootState, ThunkExtras } from './store';

export type ThunkResult<R = void> = ThunkAction<Promise<R>, RootState, ThunkExtras, Action>;
