import React from "react";
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import 'normalize.css';
import Layout from './layout';
import "./assets/css/material-dashboard-react.css?v=1.8.0";
import openIdGenerate from './utils/openIdGenerate';
import createSections from './utils/createSections';

const hist = createBrowserHistory();

const isOpened = () => typeof localStorage.getItem('opened') === 'string' && localStorage.getItem('opened') !== 'undefined' ;

/**
 * - Localization
 * - Language icons
 * - Prev Next buttons
 * */
const Localization = ({ children }) => children;
const Wrapper = ({ children }) => children;

const createDocumentation = (props) => {
    //let openIds = openIdGenerate(props);
    //const sections = createSections(props);
    const _Wrapper = typeof props.localization === 'object' ? Localization : Wrapper;

    /*openIds = isOpened() ?
            JSON.parse(localStorage.getItem('opened')) :
            openIds;*/

    render((
            <_Wrapper>
                <Router history={hist}>
                    <Layout {...Object.assign({}, props, {
                        //sections,
                        //openIds,
                        changeLocal: (e) => {
                            console.log(e.target.value)
                        },
                        toggleOpenId: (e, nodeIds) => {
                            localStorage.setItem('opened', JSON.stringify(nodeIds));
                        }
                    })} />
                </Router>
            </_Wrapper>
    ), document.getElementById('root'));
};

export default createDocumentation;
