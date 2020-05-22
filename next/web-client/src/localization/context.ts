import { createContext } from 'react';

export interface LocalizationContextInterface {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

export const LocalizationContext = createContext<LocalizationContextInterface>(null);
