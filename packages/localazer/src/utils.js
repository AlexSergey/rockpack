import urlParse from 'url-parse';
import { isArray, isObject } from 'valid-types';

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

const parseLanguageFromUrl = (url, languages) => {
    const { pathname } = urlParse(url);

    if (pathname.indexOf('/') === 0) {
        let l = pathname.substr(1);

        if (l.indexOf('/') > 0) {
            l = l.split('/')[0];
        }
        if (isArray(languages) && languages.indexOf(l) >= 0) {
            return l;
        }
        if (isObject(languages)) {
            return Object.keys(languages).indexOf(l) >= 0 ? l : false;
        }
    }

    return false;
};

export { getDefault, detectLanguage, parseLanguageFromUrl };
