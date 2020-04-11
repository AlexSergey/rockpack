import React, { useState } from 'react';
import { detectLanguage, LocalizationObserver } from '@rock/localazer';
import { withRouter } from 'react-router-dom';
import { isObject, isString } from 'valid-types';
import parseLanguageFromUrl from '../utils/parseLanguageFromUrl';
const Wrapper = ({ children }) => children;
export const LangWrapper = withRouter((props) => {
    const isLocalized = isObject(props.localization);
    const LocalizationWrapper = isLocalized ? LocalizationObserver : Wrapper;
    let activeLanguage;
    if (isLocalized) {
        activeLanguage = parseLanguageFromUrl(document.location.pathname, Object.keys(props.localization));
        if (!activeLanguage && Object.keys(props.localization).length > 0) {
            const lang = detectLanguage();
            const langs = Array.isArray(lang) ? lang : [lang];
            const defaultLang = langs.map(e => (e.indexOf('-') ? e.split('-')[0] : e))[0];
            if (props.localization && props.localization[defaultLang]) {
                activeLanguage = defaultLang;
            }
            else if (props.localization) {
                activeLanguage = Object.keys(props.localization)[0];
            }
        }
    }
    if (!isString(activeLanguage)) {
        return (React.createElement(Wrapper, null, props.children()));
    }
    const [languageState, localization] = useState(activeLanguage);
    const languages = Object.keys(props.localization)
        .reduce((a, b) => {
        a[b] = props.localization[b].language ? props.localization[b].language : props.localization[b];
        return a;
    }, {});
    return (React.createElement(LocalizationWrapper, Object.assign({}, Object.assign({}, isLocalized ? {
        languages,
        active: activeLanguage
    } : {})), props.children(isLocalized, languageState, (lang) => {
        const newUrl = isString(activeLanguage) ?
            document.location.pathname.replace(`/${activeLanguage}`, `/${lang}`) :
            false;
        if (typeof newUrl === 'string') {
            props.history.push(newUrl);
        }
        if (props.localization[lang]) {
            localization(lang);
        }
        else {
            console.warn(`Can't set language ${lang}. This language not available in localization config`);
        }
    })));
});
