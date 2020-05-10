const languages = ['ru', 'en'];

const defaultLanguage = 'en';

export const getDefaultLanguage = (): string => defaultLanguage;

export const getLanguages = (): string[] => languages;

export const hasLanguage = (lang: string): boolean => getLanguages().indexOf(lang) > -1;
