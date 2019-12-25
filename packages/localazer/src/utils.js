const getDefault = (defaultLang = 'en', defaultLocaleData) => {
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

const detectLanguage = () => {
    return global.navigator.languages
        ? global.navigator.languages[0]
        : (global.navigator.language || global.navigator.userLanguage)
};

export { getDefault, detectLanguage };
