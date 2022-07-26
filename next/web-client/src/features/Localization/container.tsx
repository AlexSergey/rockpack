import { LocalizationObserver } from '@localazer/component';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ILocalization, Languages } from '../../types/localization';
import { IRootState, Dispatcher } from '../../types/store';

import { LocalizationContext } from './context';
import { fetchLocalization } from './thunks';
import { getDefaultLanguage } from './utils';

export const LocalizationContainer = ({ children }): JSX.Element => {
  const dispatcher = useDispatch<Dispatcher>();
  const { currentLanguage, languages } = useSelector<IRootState, ILocalization>((state) => state.localization);

  const changeLanguage = (language: Languages): void => {
    dispatcher(
      fetchLocalization({
        language,
        languages,
      }),
    );
  };

  return (
    // eslint-disable-next-line max-len
    <LocalizationObserver
      defaultLanguage={getDefaultLanguage()}
      languages={languages}
      currentLanguage={currentLanguage}
    >
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <LocalizationContext.Provider
        value={{
          changeLanguage,
          currentLanguage,
        }}
      >
        {children}
      </LocalizationContext.Provider>
    </LocalizationObserver>
  );
};
