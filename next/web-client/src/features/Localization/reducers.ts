import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import { getDefaultLocale } from '@rockpack/localazer';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { Localization } from '../../types/Localization';

export const localizationReducer = createReducer<Localization>({
  locale: getDefaultLocale(),
  currentLanguage: getDefaultLanguage()
}, {
  [setLocale.type]: (state, { payload: { locale, language } }) => (
    produce(state, draftState => {
      draftState.locale = locale;
      draftState.currentLanguage = language;
    })
  )
});
