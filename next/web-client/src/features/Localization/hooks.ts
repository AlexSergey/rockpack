import { useContext } from 'react';
import { LocalizationContext } from './context';
import { Languages } from '../../types/Localization';

export const useCurrentLanguage = (): Languages => useContext(LocalizationContext).currentLanguage;

interface LocalizationAPIInterface {
  changeLanguage: (lang: Languages) => void;
}

export const useLocalizationAPI = (): LocalizationAPIInterface => {
  const ctx = useContext(LocalizationContext);

  return {
    changeLanguage: ctx.changeLanguage
  };
};
