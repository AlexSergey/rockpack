import React from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@rockpack/localazer';
//import { useWillMount, isClient } from '@rockpack/ussr';
import { fetchLocale } from './actions';
import { LocalizationState } from '../../types/Localization';
import { RootState } from '../../types/store';
import { getDefaultLanguage } from './utils';
import { LocalizationContext } from './context';

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
