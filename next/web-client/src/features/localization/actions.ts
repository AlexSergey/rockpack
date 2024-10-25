import { createAction } from '@reduxjs/toolkit';

import { LocalizationPayload } from './types';

export const setLocale = createAction<LocalizationPayload>('Set locale');
