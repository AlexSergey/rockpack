export type LocaleData = {
  domain: string;
  locale_data: any;
};

const getDefault = (defaultLang = 'en', defaultLocaleData: LocaleData) => {
  if (defaultLocaleData &&
    defaultLocaleData.locale_data &&
    defaultLocaleData &&
    defaultLocaleData.locale_data.messages) {
    return defaultLocaleData;
  }
  return {
    locale_data: {
      messages: {
        '': {
          domain: 'messages',
          lang: defaultLang,
          plural_forms: 'nplurals=2; plural=(n != 1);'
        }
      }
    }
  };
};

const detectLanguage = (): string|string[] => (
  window.navigator.languages ?
    window.navigator.languages[0] :
    window.navigator.language
);

export { getDefault, detectLanguage };