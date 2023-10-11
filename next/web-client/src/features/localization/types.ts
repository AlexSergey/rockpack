import { LocaleData } from '@localazer/component';

import { Languages } from '../../types/localization';

export interface ILocalizationPayload {
  language: Languages;
  locale: LocaleData;
}
