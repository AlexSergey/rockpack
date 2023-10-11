import { useContext } from 'react';

import { Languages } from '../../types/localization';
import { LocalizationContext } from './context';

export const useCurrentLanguage = (): Languages => useContext(LocalizationContext).currentLanguage;

interface ILocalizationApi {
  changeLanguage: (lang: Languages) => void;
}

export const useLocalizationAPI = (): ILocalizationApi => {
  const ctx = useContext(LocalizationContext);

  return {
    changeLanguage: ctx.changeLanguage,
  };
};
