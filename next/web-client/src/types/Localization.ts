import { LocaleData } from '@rockpack/localazer';

export enum Languages {
  ru = 'ru',
  en = 'en'
}

export interface Localization {
  locale: LocaleData;
  currentLanguage: Languages;
}
