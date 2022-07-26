import { Languages } from './types/localization';

export const config = {
  api: process.env.API,
  defaultLanguage: Languages.en,
  fileFormats: ['image/jpeg', 'image/png', 'image/jpg'],
  languages: [Languages.ru, Languages.en],
  maxPhotos: 10,
  postsLimit: 10,
};
