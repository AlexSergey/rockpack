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

const getLanguage = (languages) => {
    let currentLanguage = detectLanguage();
    if (currentLanguage) {
        currentLanguage = currentLanguage.indexOf('-') > 0 ? currentLanguage.split('-') : [currentLanguage];
        currentLanguage = currentLanguage.map(l => l.toLowerCase());

        if (typeof languages === 'object') {
            let activeLang = false;
            Object.keys(languages).forEach(l => {
                if (typeof activeLang !== 'string') {
                    if (currentLanguage.indexOf(l) >= 0) {
                        activeLang = l;
                    }
                }
            });
            return activeLang;
        }
    }
    return false;
};

export { getDefault, detectLanguage, getLanguage };
