import React, { createContext } from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@rockpack/localazer';
import { fetchLocale } from './action';
import { LocalizationState } from './reducer';
import { RootState } from '../store';
import { getDefaultLanguage } from './utils';

export interface LocalizationContextInterface {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

export const LocalizationContext = createContext<LocalizationContextInterface>(null);

export const LocalizationContainer = withRouter(({ children, history }): JSX.Element => {
  const dispatcher = useDispatch();
  const { currentLanguage, locale, loading, error } = useSelector<RootState, LocalizationState>(
    (state) => state.localization
  );
  const languages = { [currentLanguage]: locale };

  const changeLanguage = (lang: string): void => {
    dispatcher(fetchLocale(lang))
      .then(() => history.push(`/${lang}`))
      .catch(() => console.log('well'));
  };

  console.log(loading && 'Loading...');
  console.log(error && 'Error!!!');

  return (
    <LocalizationObserver defaultLang={getDefaultLanguage()} languages={languages} active={currentLanguage}>
      <LocalizationContext.Provider value={{
        currentLanguage,
        changeLanguage
      }}
      >
        {children}
      </LocalizationContext.Provider>
    </LocalizationObserver>
  );
});
