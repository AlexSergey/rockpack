import React from 'react';
import { Action } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationObserver } from '@localazer/component';
import { fetchLocalization } from './thunks';
import { Localization, Languages } from '../../types/Localization';
import { RootState, ThunkExtras } from '../../types/store';
import { getDefaultLanguage } from './utils';
import { LocalizationContext } from './context';

export const LocalizationContainer = ({ children }): JSX.Element => {
  const navigate = useNavigate();
  const dispatcher = useDispatch<ThunkDispatch<RootState, ThunkExtras, Action>>();
  const { currentLanguage, languages } = useSelector<RootState, Localization>(
    (state) => state.localization
  );

  const changeLanguage = (language: Languages): void => {
    dispatcher(
      fetchLocalization({
        language,
        languages
      })
    ).then((needToRedirect) => {
      if (needToRedirect) {
        navigate(`/${language}`);
      }
    });
  };

  return (
    // eslint-disable-next-line max-len
    <LocalizationObserver defaultLanguage={getDefaultLanguage()} languages={languages} currentLanguage={currentLanguage}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <LocalizationContext.Provider value={{
        currentLanguage,
        changeLanguage
      }}
      >
        {children}
      </LocalizationContext.Provider>
    </LocalizationObserver>
  );
};
