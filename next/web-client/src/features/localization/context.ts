import { createContext } from 'react';

import { Languages } from '../../types/localization';

export interface ILocalizationContext {
  changeLanguage: (lang: Languages) => void;
  currentLanguage: Languages;
}

export const LocalizationContext = createContext<ILocalizationContext>(null);
