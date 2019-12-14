import React, { useState } from "react";
import { LocalizationObserver, parseLanguageFromUrl } from '@rock/localazer';
import findPathToActiveRoute from './utils/findPathToActiveRoute';
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { Router, withRouter } from "react-router-dom";
import 'normalize.css';
import Layout from './layout';
import "./assets/css/material-dashboard-react.css?v=1.8.0";
import openIdGenerate from './utils/openIdGenerate';
import mergeUrls from './utils/mergeUrls';
import validation from './utils/validation';

const hist = createBrowserHistory();

const Wrapper = ({ children }) => children;

const OpenIds = ({ children, openIds }) => {
    let [openIdsState, setOpenIds] = useState(openIds);

    return children(openIdsState, setOpenIds);
};

const LangWrapper = withRouter((props) => {
    const isLocalized = typeof props.localization === 'object';
    const _Wrapper = isLocalized ? LocalizationObserver : Wrapper;

    let activeLanguage = false;

    if (isLocalized) {
        activeLanguage = parseLanguageFromUrl(global.document.location.pathname, props.languages) || 'us';
    }

    if (typeof activeLanguage !== 'string') {
        return (
            <Wrapper>
                {props.children()}
            </Wrapper>
        )
    }

    let [languageState, localization] = useState(activeLanguage);

    return (
        <_Wrapper {...Object.assign({}, isLocalized ? {
            languages: props.localization,
            active: activeLanguage
        } : {})}>
            {props.children(isLocalized, languageState, (lang) => {
                console.log(lang);
                let newUrl = typeof activeLanguage === 'string' ? global.document.location.pathname.replace(`/${activeLanguage}`, `/${lang}`) : false;
                console.log(newUrl);
                if (newUrl) {
                    props.history.push(newUrl);
                }
                if (props.localization[lang]) {
                    localization(lang);
                }
                else {
                    console.warn(`Can't set language ${lang}. This language not available in localization config`);
                }
            })}
        </_Wrapper>
    )
});

const createDocumentation = (props) => {
    let isValid = validation(props);
    if (!isValid) {
        return false;
    }
    const isLocalized = typeof props.localization === 'object';

    mergeUrls(props.docgen);
    let allOpened = openIdGenerate(props.docgen, []);

    let openIds = [];
    openIds = allOpened;
    let found = false;

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
    ), document.getElementById('root'));
};

export default createDocumentation;
