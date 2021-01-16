import { LocaleData } from '@localazer/component';

// eslint-disable-next-line no-shadow
export enum Languages {
  ru = 'ru',
  en = 'en'
}

export interface LanguageList {
  [key: string]: LocaleData;
}

export interface Localization {
  currentLanguage: Languages;
  languages: LanguageList;
}
