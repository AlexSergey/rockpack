import React from 'react';
import { useSelector } from 'react-redux';
// import { fetchLocale } from './action';
import { LocalizationObserver } from '@rock/localazer';
import { LocalizationState } from './reducer';
import { RootState } from '../store';
import { getLanguages } from './utils';

interface LocalizationShared {
  currentLanguage: string;
  languages: string[];
}

export const Localization = ({ children }: { children: (props: LocalizationShared) => JSX.Element }): JSX.Element => {
  const { currentLanguage } = useSelector<RootState, LocalizationState>((state) => state.localization);

  return (
    <LocalizationObserver>
      {children({
        currentLanguage,
        languages: getLanguages()
      })}
    </LocalizationObserver>
  );
};
