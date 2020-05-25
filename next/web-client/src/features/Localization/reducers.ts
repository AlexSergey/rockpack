import produce, { Draft } from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { getDefaultLocale } from '@rockpack/localazer';
import { fetchLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { LocalizationState } from './types';

export const localizationReducer = createReducer<LocalizationState>({
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
