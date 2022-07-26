import { LocaleData } from '@localazer/component';

// eslint-disable-next-line no-shadow
export enum Languages {
  ru = 'ru',
  en = 'en',
}

export interface ILanguageList {
  [key: string]: LocaleData;
}

export interface ILocalization {
  currentLanguage: Languages;
  languages: ILanguageList;
}
