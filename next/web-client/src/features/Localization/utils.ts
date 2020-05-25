import config from '../../config';

const { languages, defaultLanguage } = config;

export const getDefaultLanguage = (): string => defaultLanguage;

export const getLanguages = (): string[] => languages;

export const hasLanguage = (lang: string): boolean => getLanguages().indexOf(lang) > -1;

const hasLanguageInUrl = (url): boolean => {
  const l = url.split('/')[1];
  return hasLanguage(typeof l === 'string' ? l : '');
};

const getLanguageFromUrl = (url): string => url.split('/')[1];

export const getCurrentLanguageFromURL = (url: string, acceptsLanguages: (languages: string[]) => string): string => {
  url = url.indexOf('/') === 0 ? url.slice(1) : url;
  const _lang = hasLanguageInUrl(url) ?
    getLanguageFromUrl(url) :
    acceptsLanguages(getLanguages());

  return typeof _lang === 'string' && hasLanguage(_lang) ?
    _lang :
    getDefaultLanguage();
};
