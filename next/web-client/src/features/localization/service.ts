import { LocaleData } from '@localazer/component';

import { Languages } from '../../types/localization';
import { IRest } from '../../utils/rest';

export interface ILocalizationService {
  fetchLocalization: (language: Languages) => Promise<LocaleData>;
}

export const localizationService = (rest: IRest): ILocalizationService => ({
  fetchLocalization: (language) => rest.get(`/locales/${language}.json`),
});
