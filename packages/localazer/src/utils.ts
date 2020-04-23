type ReturnLocaleData = {
  locale_data: {
    [key: string]: unknown;
  };
};

export type LocaleData = {
  domain: string;
  locale_data: {
    [key: string]: unknown;
  };
};

const getDefault = (defaultLang = 'en', defaultLocaleData: LocaleData): ReturnLocaleData => {
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

const detectBrowserLanguage = (): string|string[] => (
  window.navigator.languages ?
    window.navigator.languages[0] :
    window.navigator.language
);

export { getDefault, detectBrowserLanguage };
