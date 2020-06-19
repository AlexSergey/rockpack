import { LocaleData } from '@rockpack/localazer';
import { Languages } from '../../types/Localization';

export interface LocalizationServiceInterface {
  fetchLocalization: (language: Languages) => LocaleData;
}

export const localizationService = (rest): LocalizationServiceInterface => ({
  fetchLocalization: (language) => rest.get(`/locales/${language}.json`)
});
