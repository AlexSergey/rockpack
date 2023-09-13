import { Action, ThunkDispatch } from '@reduxjs/toolkit';

import { IRootState, IThunkExtras } from './store';

export type ThunkResult = ThunkDispatch<IRootState, IThunkExtras, Action>;
