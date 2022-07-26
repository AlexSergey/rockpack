// eslint-disable-next-line import/no-extraneous-dependencies
import { Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import { IRootState, IThunkExtras } from './store';

export type ThunkResult<R = void> = ThunkAction<Promise<R>, IRootState, IThunkExtras, Action>;
