import { LocaleData } from '@localazer/component';
import { Languages } from '../../types/Localization';
import { RestInterface } from '../../utils/rest';

export interface LocalizationServiceInterface {
  fetchLocalization: (language: Languages) => Promise<LocaleData>;
}

export const localizationService = (rest: RestInterface): LocalizationServiceInterface => ({
  fetchLocalization: (language) => rest.get(`/locales/${language}.json`)
});
