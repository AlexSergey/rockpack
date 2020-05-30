import { LocaleData } from '@rockpack/localazer';

export enum Languages {
  ru = 'ru',
  en = 'en'
}

export interface LocalizationState {
  locale: LocaleData;
  currentLanguage: Languages;
}
