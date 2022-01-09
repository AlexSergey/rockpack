import { createAction } from '@reduxjs/toolkit';
import { LocaleData } from '@localazer/component';
import { Languages } from '../../types/Localization';

export const setLocale = createAction<{ locale: LocaleData; language: Languages }>('Set locale');
