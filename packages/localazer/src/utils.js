const getDefault = (defaultLang = 'en') => {
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
