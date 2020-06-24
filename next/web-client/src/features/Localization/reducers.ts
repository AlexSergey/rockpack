import { createReducer } from '@reduxjs/toolkit';
import { getDefaultLocale } from '@rockpack/localazer';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { Localization } from '../../types/Localization';

export const localizationReducer = createReducer<Localization>({
  locale: getDefaultLocale(),
  currentLanguage: getDefaultLanguage()
}, {
  [setLocale.type]: (state, { payload: { locale, language } }) => {
    state.locale = locale;
    state.currentLanguage = language;
  }
});
