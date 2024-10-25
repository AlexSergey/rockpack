import { LocaleData } from '@localazer/component';

import { Languages } from '../../types/localization';

export interface LocalizationPayload {
  language: Languages;
  locale: LocaleData;
}
