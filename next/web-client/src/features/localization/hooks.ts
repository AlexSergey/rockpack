import { useContext } from 'react';

import { Languages } from '../../types/localization';
import { LocalizationContext } from './context';

export const useCurrentLanguage = (): Languages => useContext(LocalizationContext).currentLanguage;

interface LocalizationApi {
  changeLanguage: (lang: Languages) => void;
}

export const useLocalizationAPI = (): LocalizationApi => {
  const ctx = useContext(LocalizationContext);

  return {
    changeLanguage: ctx.changeLanguage,
  };
};
