import { getDefaultLocale } from '@localazer/component';
import { createReducer } from '@reduxjs/toolkit';

import { ActionWithPayload } from '../../types/actions';
import { Localization } from '../../types/localization';
import { setLocale } from './actions';
import { LocalizationPayload } from './types';
import { getDefaultLanguage } from './utils';

export const localizationReducer = createReducer<Localization>(
  {
    currentLanguage: getDefaultLanguage(),
    languages: {
      [getDefaultLanguage()]: getDefaultLocale(),
    },
  },
  (builder) => {
    builder.addCase(
      setLocale.type,
      (state, { payload: { language, locale } }: ActionWithPayload<LocalizationPayload>) => {
        state.languages[language] = locale;
        state.currentLanguage = language;
      },
    );
  },
);
