import { createAction } from '@reduxjs/toolkit';

import { ILocalizationPayload } from './types';

export const setLocale = createAction<ILocalizationPayload>('Set locale');
