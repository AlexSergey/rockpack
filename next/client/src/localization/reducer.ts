import produce, { Draft } from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { LocaleData, getDefaultLocale } from '@rockpack/localazer';
import { fetchLocale } from './action';
import { getDefaultLanguage } from './utils';

export interface LocalizationState {
  loading: boolean;
  error: boolean;
  locale: LocaleData;
  currentLanguage: string;
}

export default createReducer<LocalizationState>({
  loading: false,
  error: false,
  locale: getDefaultLocale(),
  currentLanguage: getDefaultLanguage()
}, {
  [fetchLocale.trigger]: (state) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.loading = true;
    })
  ),

  [fetchLocale.resolved]: (state, { payload: { locale, language } }) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.locale = locale;
      draftState.currentLanguage = language;
    })
  ),

  [fetchLocale.rejected]: (state) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.loading = false;
      draftState.error = true;
    })
  )
});
