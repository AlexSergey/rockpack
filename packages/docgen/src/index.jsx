import 'normalize.css';
import React, { useState } from "react";
import GoogleAnalytics from "react-ga";
import { isObject, isString, isArray } from 'valid-types';
import { LocalizationObserver, detectLanguage } from '@rock/localazer';
import findPathToActiveRoute from './utils/findPathToActiveRoute';
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { Router, withRouter } from "react-router-dom";
import Layout from './layout';
import "./assets/css/material-dashboard-react.css";
import openIdGenerate from './utils/openIdGenerate';
import mergeUrls from './utils/mergeUrls';
import validation from './utils/validation';
import parseLanguageFromUrl from './utils/parseLanguageFromUrl';
const hist = createBrowserHistory();

const Wrapper = ({ children }) => children;

const OpenIds = ({ children, openIds }) => {
    let [openIdsState, setOpenIds] = useState(openIds);

    return children(openIdsState, setOpenIds);
};

/**
 * хедеры локализации
 * попробовать сделать ссылки в webpack plugin parser и локалайзере
 * */
const LangWrapper = withRouter((props) => {
    const isLocalized = isObject(props.localization);
    const _Wrapper = isLocalized ? LocalizationObserver : Wrapper;

    let activeLanguage = false;

    if (isLocalized) {
        activeLanguage = parseLanguageFromUrl(global.document.location.pathname, Object.keys(props.localization));

        if (!activeLanguage && Object.keys(props.localization).length > 0) {
            let lang = detectLanguage();
            lang = isArray(lang) ? lang : [lang];
            let defaultLang = lang.map(e => e.indexOf('-') ? e.split('-')[0] : e)[0];

            if (props.localization[defaultLang]) {
                activeLanguage = defaultLang;
            }
            else {
                activeLanguage = Object.keys(props.localization)[0];
            }
        }
    }

    if (!isString(activeLanguage)) {
        return (
            <Wrapper>
                {props.children()}
            </Wrapper>
        )
    }

    let [languageState, localization] = useState(activeLanguage);

    let languages = Object.keys(props.localization)
        .reduce((a, b) => {
            a[b] = props.localization[b].language ? props.localization[b].language : props.localization[b];
            return a;
        }, {});

    return (
        <_Wrapper {...Object.assign({}, isLocalized ? {
            languages: languages,
            active: activeLanguage
        } : {})}>
            {props.children(isLocalized, languageState, (lang) => {
                let newUrl = isString(activeLanguage) ?
                    global.document.location.pathname.replace(`/${activeLanguage}`, `/${lang}`) :
                    false;

                if (newUrl) {
                    props.history.push(newUrl);
                }
                if (props.localization[lang]) {
                    localization(lang);
                }
                else {
                    global['console'].warn(`Can't set language ${lang}. This language not available in localization config`);
                }
            })}
        </_Wrapper>
    )
});

const createDocumentation = (props, el) => {
    if (!(el instanceof HTMLElement)) {
        global['console'].error('DOM element is invalid');
        return false;
    }
    let isValid = validation(props);

    if (!isValid) {
        global['console'].error('props is invalid');
        return false;
    }

    const hasRoutes = Array.isArray(props.docgen);
    console.log(hasRoutes);
    if (hasRoutes) {
        mergeUrls(props.docgen);
    }
    let allOpened = hasRoutes ? openIdGenerate(props.docgen, []) : [];

    let openIds = [];
    openIds = allOpened;
    let found = false;

    if (isString(props.ga)) {
        GoogleAnalytics.initialize(props.ga);
    }
    if (hasRoutes) {
        props.docgen.forEach(section => {
            let pathToRoute = findPathToActiveRoute(global.document.location.pathname, section, []);

            if (pathToRoute.length > 0) {
                if (!found) {
                    openIds = pathToRoute;
                    found = true;
                }
                setTimeout(() => {
                    let el = document.getElementById(pathToRoute[pathToRoute.length - 1]);
                    if (el) {
                        el.scrollIntoView();
                    }
                }, 300);
            }
        });
    }

    let languages = false;

    if (typeof props.localization === 'object') {
        languages = Object.keys(props.localization);
    }

    render((
        <Router history={hist}>
            <LangWrapper {...props}>
                {(isLocalized, activeLang, changeLocal) => (
                    <OpenIds {...props} openIds={openIds}>
                        {(openIds, setOpenIds) => (
                            <Layout {...Object.assign({}, props, {
                                openIds: openIds,
                                hasRoutes,
                                isLocalized,
                                activeLang,
                                changeLocal,
                                languages,
                                toggleOpenId: (node) => {
                                    setTimeout(() => {
                                        let found = false;
                                        props.docgen.forEach(section => {
                                            let pathToRoute = findPathToActiveRoute(global.document.location.pathname, section, []);

                                            if (pathToRoute.length > 0) {
                                                if (!found) {
                                                    setOpenIds(pathToRoute);
                                                    setTimeout(() => {
                                                        let el = document.getElementById(pathToRoute[pathToRoute.length - 1]);
                                                        if (el) {
                                                            el.scrollIntoView();
                                                        }
                                                    }, 300);
                                                    found = true;
                                                }
                                            }
                                        });
                                    });
                                }
                            })} />
                        )}
                    </OpenIds>
                )}
            </LangWrapper>
        </Router>
    ), el);
};

export default createDocumentation;
