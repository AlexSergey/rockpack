import { LocaleData } from '@localazer/component';

// eslint-disable-next-line no-shadow
export enum Languages {
  en = 'en',
  ru = 'ru',
}

export interface ILanguageList {
  [key: string]: LocaleData;
}

export interface ILocalization {
  currentLanguage: Languages;
  languages: ILanguageList;
}
