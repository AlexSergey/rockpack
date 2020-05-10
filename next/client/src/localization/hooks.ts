import { useContext } from 'react';
import { LocalizationContext } from './Container';

export const useCurrentLanguage = (): string => useContext(LocalizationContext).currentLanguage;

interface LocalizationAPI {
  changeLanguage: (lang: string) => void;
}

export const useLocalizationAPI = (): LocalizationAPI => {
  const ctx = useContext(LocalizationContext);

  return {
    changeLanguage: ctx.changeLanguage
  };
};
