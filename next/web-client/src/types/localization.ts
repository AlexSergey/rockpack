import { LocaleData } from '@localazer/component';

// eslint-disable-next-line no-shadow
export enum Languages {
  en = 'en',
  ru = 'ru',
}

export type ILanguageList = Record<string, LocaleData>;

export interface ILocalization {
  currentLanguage: Languages;
  languages: ILanguageList;
}
