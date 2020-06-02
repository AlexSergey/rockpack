import React from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@rockpack/localazer';
import { fetchLocalization } from './actions';
import { Localization, Languages } from '../../types/Localization';
import { RootState } from '../../types/store';
import { getDefaultLanguage } from './utils';
import { LocalizationContext } from './context';

export const LocalizationContainer = withRouter(({ children }): JSX.Element => {
  const dispatcher = useDispatch();
  const { currentLanguage, locale } = useSelector<RootState, Localization>(
    (state) => state.localization
  );

  const languages = { [currentLanguage]: locale };

  const changeLanguage = (lang: Languages): void => {
    dispatcher(fetchLocalization(lang));
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
