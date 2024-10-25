import { Action, ThunkDispatch } from '@reduxjs/toolkit';

import { RootState, ThunkExtras } from './store';

export type ThunkResult = ThunkDispatch<RootState, ThunkExtras, Action>;
