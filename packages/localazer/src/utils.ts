export type LocaleData = {
  domain?: string;
  locale_data: {
    [key: string]: unknown;
  };
};

const getDefault = (defaultLang = 'en', defaultLocaleData?: LocaleData): LocaleData => {
  if (defaultLocaleData &&
    defaultLocaleData.locale_data &&
    defaultLocaleData &&
    defaultLocaleData.locale_data.messages) {
    return defaultLocaleData;
  }
  return {
    // eslint-disable-next-line @typescript-eslint/camelcase
    locale_data: {
      messages: {
        '': {
          domain: 'messages',
          lang: defaultLang,
          // eslint-disable-next-line @typescript-eslint/camelcase
          plural_forms: 'nplurals=2; plural=(n != 1);'
        }
      }
    }
  };
};

const detectBrowserLanguage = (): string|string[] => (
  globalThis.navigator.languages ?
    globalThis.navigator.languages[0] :
    globalThis.navigator.language
);

export { getDefault, detectBrowserLanguage };
