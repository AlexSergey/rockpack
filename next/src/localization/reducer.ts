import produce, { Draft } from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { LocaleData, getDefaultLocale } from '@rock/localazer';
import { changeLanguage, requestLocale, requestLocaleSuccess, requestLocaleError } from './action';
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
  [changeLanguage.type]: (state, { payload }) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.currentLanguage = payload;
    })
  ),

  [requestLocale.type]: (state) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.loading = true;
    })
  ),

  [requestLocaleSuccess.type]: (state, { payload }) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.locale = payload;
    })
  ),

  [requestLocaleError.type]: (state) => (
    produce<Draft<LocalizationState>>(state, draftState => {
      draftState.loading = false;
      draftState.error = true;
    })
  )
});
