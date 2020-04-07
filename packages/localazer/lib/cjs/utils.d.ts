export declare type LocaleData = {
    domain: string;
    locale_data: any;
};
declare const getDefault: (defaultLang: string, defaultLocaleData: LocaleData) => LocaleData | {
    locale_data: {
        messages: {
            '': {
                domain: string;
                lang: string;
                plural_forms: string;
            };
        };
    };
};
declare const detectLanguage: () => string | string[];
export { getDefault, detectLanguage };
