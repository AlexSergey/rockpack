import i18n from 'i18next';
import Backend from 'i18next-chained-backend';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import LocalStorageBackend from 'i18next-localstorage-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: ['ru'],
    backend: {
      backends: [
        LocalStorageBackend,
        XHR
      ],
      backendOptions: [{}, {
        loadPath: '/lang/{{lng}}/translation.json',
      }]
    },
    fallbackLng: ['en'],
    whitelist: ['en', 'ru'],
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true,
      useSuspense: false
    },
  });

export default i18n;
