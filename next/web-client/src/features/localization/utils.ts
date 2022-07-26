import { config } from '../../config';
import { Languages } from '../../types/localization';

const { languages, defaultLanguage } = config;

export const getDefaultLanguage = (): Languages => defaultLanguage;

export const getLanguages = (): Languages[] => languages;

export const hasLanguage = (lang: Languages): boolean => getLanguages().indexOf(lang) > -1;

export const getCurrentLanguageFromURL = (
  url: string,
  acceptsLanguages: (languages: Languages[]) => Languages,
): Languages => {
  const langUrl: Languages = url.indexOf('/') === 0 ? (url.slice(1) as Languages) : Languages.en;

  const _lang = hasLanguage(langUrl) ? langUrl : acceptsLanguages(getLanguages());

  return typeof _lang === 'string' && hasLanguage(_lang) ? _lang : getDefaultLanguage();
};
