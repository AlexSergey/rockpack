import React, { useState } from "react";
import findPathToActiveRoute from './utils/findPathToActiveRoute';
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import 'normalize.css';
import Layout from './layout';
import "./assets/css/material-dashboard-react.css?v=1.8.0";
import openIdGenerate from './utils/openIdGenerate';
import mergeUrls from './utils/mergeUrls';

const hist = createBrowserHistory();

/**
 * - Localization, localization in the route
 * - validation, errors
 * - styles
 * - customization
 * */
const Localization = ({ children }) => children;
const Wrapper = ({ children }) => children;

const OpenIds = ({ children, openIds }) => {
    let [openIdsState, setOpenIds] = useState(openIds);

    return children(openIdsState, setOpenIds);
};

const createDocumentation = (props) => {
    mergeUrls(props.sections);
    let allOpened = openIdGenerate(props.sections, 0, []);
    const _Wrapper = typeof props.localization === 'object' ? Localization : Wrapper;

    let openIds = [];
    openIds = allOpened;
    let found = false;

    props.sections.forEach(section => {
        let pathToRoute = findPathToActiveRoute(global.document.location.pathname, section, []);

        if (pathToRoute.length > 0) {
            if (!found) {
                openIds = pathToRoute;
                found = true;
            }
        }
    });

    render((
            <_Wrapper>
                <Router history={hist}>
                    <OpenIds {...props} openIds={openIds}>
                        {(openIds, setOpenIds) => (
                            <Layout {...Object.assign({}, props, {
                                openIds: openIds,
                                changeLocal: (e) => {
                                    console.log(e.target.value)
                                },
                                toggleOpenId: (node) => {
                                    setTimeout(() => {
                                        let found = false;
                                        props.sections.forEach(section => {
                                            let pathToRoute = findPathToActiveRoute(global.document.location.pathname, section, []);

                                            if (pathToRoute.length > 0) {
                                                if (!found) {
                                                    setOpenIds(pathToRoute);
                                                    found = true;
                                                }
                                            }
                                        });
                                    });
                                }
                            })} />
                        )}
                    </OpenIds>
                </Router>
            </_Wrapper>
    ), document.getElementById('root'));
};

export default createDocumentation;
