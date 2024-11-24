import { LocaleData } from '@localazer/component';

export enum Languages {
  en = 'en',
  ru = 'ru',
}

export type LanguageList = Record<string, LocaleData>;

export interface Localization {
  currentLanguage: Languages;
  languages: LanguageList;
}
