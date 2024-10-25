import { createContext } from 'react';

import { Languages } from '../../types/localization';

export interface LocalizationContext {
  changeLanguage: (lang: Languages) => void;
  currentLanguage: Languages;
}

export const LocalizationContext = createContext<LocalizationContext>(null);
