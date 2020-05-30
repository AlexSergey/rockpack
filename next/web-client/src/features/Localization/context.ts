import { createContext } from 'react';
import { Languages } from '../../types/Localization';

export interface LocalizationContextInterface {
  currentLanguage: Languages;
  changeLanguage: (lang: Languages) => void;
}

export const LocalizationContext = createContext<LocalizationContextInterface>(null);
