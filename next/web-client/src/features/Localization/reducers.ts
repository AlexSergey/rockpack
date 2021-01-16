import { createReducer } from '@reduxjs/toolkit';
import { getDefaultLocale } from '@localazer/component';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { Localization } from '../../types/Localization';

export const localizationReducer = createReducer<Localization>({
  currentLanguage: getDefaultLanguage(),
  languages: {
    [getDefaultLanguage()]: getDefaultLocale()
  }
}, {
  [setLocale.type]: (state, { payload: { locale, language } }) => {
    state.languages[language] = locale;
    state.currentLanguage = language;
  }
});
