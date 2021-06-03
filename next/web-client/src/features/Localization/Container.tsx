import React from 'react';
import { withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@localazer/component';
import { fetchLocalization } from './thunks';
import { Localization, Languages } from '../../types/Localization';
import { RootState } from '../../types/store';
import { getDefaultLanguage } from './utils';
import { LocalizationContext } from './context';

export const LocalizationContainer = withRouter(({ children }): JSX.Element => {
  const dispatcher = useDispatch();
  const { currentLanguage, languages } = useSelector<RootState, Localization>(
    (state) => state.localization
  );

  const changeLanguage = (language: Languages): void => {
    dispatcher(fetchLocalization({
      language,
      languages
    }));
  };

  return (
    // eslint-disable-next-line max-len
    <LocalizationObserver defaultLanguage={getDefaultLanguage()} languages={languages} currentLanguage={currentLanguage}>
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
