import { LocaleData } from '@rockpack/localazer';

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
