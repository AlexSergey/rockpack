import { LocaleData } from '@localazer/component';
import { createAction } from '@reduxjs/toolkit';

import { Languages } from '../../types/localization';

export const setLocale = createAction<{ locale: LocaleData; language: Languages }>('Set locale');
