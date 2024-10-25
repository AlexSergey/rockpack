import { Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import { RootState, ThunkExtras } from './store';

export type ThunkResult<R = void> = ThunkAction<Promise<R>, RootState, ThunkExtras, Action>;
