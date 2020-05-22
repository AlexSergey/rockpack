import { LocaleData } from '@rockpack/localazer';

export interface LocalizationState {
  loading: boolean;
  error: boolean;
  locale: LocaleData;
  currentLanguage: string;
}
