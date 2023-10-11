import { getDefaultLocale } from '@localazer/component';
import { createReducer } from '@reduxjs/toolkit';

import { IActionWithPayload } from '../../types/actions';
import { ILocalization } from '../../types/localization';
import { setLocale } from './actions';
import { ILocalizationPayload } from './types';
import { getDefaultLanguage } from './utils';

export const localizationReducer = createReducer<ILocalization>(
  {
    currentLanguage: getDefaultLanguage(),
    languages: {
      [getDefaultLanguage()]: getDefaultLocale(),
    },
  },
  (builder) => {
    builder.addCase(
      setLocale.type,
      (state, { payload: { language, locale } }: IActionWithPayload<ILocalizationPayload>) => {
        state.languages[language] = locale;
        state.currentLanguage = language;
      },
    );
  },
);
