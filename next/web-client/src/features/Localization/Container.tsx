import React from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@rockpack/localazer';
import { fetchLocale } from './actions';
import { LocalizationState, Languages } from '../../types/Localization';
import { RootState } from '../../types/store';
import { getDefaultLanguage } from './utils';
import { LocalizationContext } from './context';

export const LocalizationContainer = withRouter(({ children }): JSX.Element => {
  const dispatcher = useDispatch();
  const { currentLanguage, locale } = useSelector<RootState, LocalizationState>(
    (state) => state.localization
  );

  const languages = { [currentLanguage]: locale };

  const changeLanguage = (lang: Languages): void => {
    dispatcher(fetchLocale(lang));
  };

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
