import { createContext } from 'react';

import { Languages } from '../../types/localization';

export interface ILocalizationContext {
  currentLanguage: Languages;
  changeLanguage: (lang: Languages) => void;
}

export const LocalizationContext = createContext<ILocalizationContext>(null);
