import { getDefaultLocale } from '@localazer/component';
import { createReducer } from '@reduxjs/toolkit';

import { ILocalization } from '../../types/localization';

import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';

export const localizationReducer = createReducer<ILocalization>(
  {
    currentLanguage: getDefaultLanguage(),
    languages: {
      [getDefaultLanguage()]: getDefaultLocale(),
    },
  },
  {
    [setLocale.type]: (state, { payload: { locale, language } }) => {
      state.languages[language] = locale;
      state.currentLanguage = language;
    },
  },
);
