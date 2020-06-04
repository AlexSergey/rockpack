import { Languages } from './types/Localization';

export default {
  api: process.env.API,
  languages: [Languages.ru, Languages.en],
  defaultLanguage: Languages.en,
  maxPhotos: 10,
  postsLimit: 10,
  fileFormats: ['image/jpeg', 'image/png', 'image/jpg']
};
