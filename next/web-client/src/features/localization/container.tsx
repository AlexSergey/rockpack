import { LocalizationObserver } from '@localazer/component';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ILocalization, Languages } from '../../types/localization';
import { Dispatcher, IRootState } from '../../types/store';
import { LocalizationContext } from './context';
import { fetchLocalization } from './thunks';
import { getDefaultLanguage } from './utils';

export const LocalizationContainer = ({ children }): JSX.Element => {
  const dispatcher = useDispatch<Dispatcher>();
  const { currentLanguage, languages } = useSelector<IRootState, ILocalization>((state) => state.localization);

  const changeLanguage = useCallback(
    (language: Languages): void => {
      dispatcher(
        fetchLocalization({
          language,
          languages,
        }),
      );
    },
    [languages, dispatcher],
  );

  return (
    <LocalizationObserver
      currentLanguage={currentLanguage}
      defaultLanguage={getDefaultLanguage()}
      languages={languages}
    >
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
