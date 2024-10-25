import { LocaleData } from '@localazer/component';

import { Languages } from '../../types/localization';
import { Rest } from '../../utils/rest';

export interface LocalizationService {
  fetchLocalization: (language: Languages) => Promise<LocaleData>;
}

export const localizationService = (rest: Rest): LocalizationService => ({
  fetchLocalization: (language) => rest.get(`/locales/${language}.json`),
});
