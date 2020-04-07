"use strict";
exports.__esModule = true;
var getDefault = function (defaultLang, defaultLocaleData) {
    if (defaultLang === void 0) { defaultLang = 'en'; }
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
exports.getDefault = getDefault;
var detectLanguage = function () { return (window.navigator.languages ?
    window.navigator.languages[0] :
    window.navigator.language); };
exports.detectLanguage = detectLanguage;
