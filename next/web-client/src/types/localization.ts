import { LocaleData } from '@localazer/component';

// eslint-disable-next-line no-shadow
export enum Languages {
  en = 'en',
  ru = 'ru',
}

export type LanguageList = Record<string, LocaleData>;

export interface Localization {
  currentLanguage: Languages;
  languages: LanguageList;
}
