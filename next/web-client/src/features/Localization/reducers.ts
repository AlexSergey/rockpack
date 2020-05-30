import produce, { Draft } from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { getDefaultLocale } from '@rockpack/localazer';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { LocalizationState } from '../../types/Localization';

export const localizationReducer = createReducer<LocalizationState>({
  locale: getDefaultLocale(),
  currentLanguage: getDefaultLanguage()
}, {
  [setLocale.type]: (state, { payload: { locale, language } }) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.locale = locale;
      draftState.currentLanguage = language;
    })
  )
});
