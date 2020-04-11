import React, { isValidElement, createElement } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import findRoutes from '../utils/findRoutes';
import MDXLayout from './MDXLayout';
// @ts-ignore
const useStylesPage = makeStyles(stylesHeader);
const renderInside = (content, index, props) => {
    if (!content) {
        return null;
    }
    let component = null;
    if (isValidElement(content)) {
        component = content;
    }
    else if (typeof component === 'function') {
        component = content;
    }
    else if (content.isMDXComponent) {
        component = content;
    }
    else if (content.component) {
        component = content.component;
    }
    const name = content.name;
    const title = content.title;
    const opt = {
        key: null,
        id: null
    };
    if (typeof index === 'number') {
        opt.key = index;
    }
    if (typeof name === 'string') {
        opt.id = name;
    }
    const block = (component && component.isMDXComponent ? (React.createElement(MDXLayout, Object.assign({ key: index }, props), createElement(component))) :
        isValidElement(component) ?
            component :
            typeof component === 'function' ?
                component() :
                component);
    return (React.createElement("div", Object.assign({}, Object.assign({}, opt)),
        title && React.createElement("h2", null, title),
        block));
};
const InnerPage = withRouter((props) => {
    const classesPage = useStylesPage();
    const current = typeof props.activeLang === 'string' ?
        props.match.path.replace(`/${props.activeLang}`, '') :
        props.match.path;
    const { prev, next } = findRoutes(current, props.docgen);
    return (React.createElement(Paper, { style: { padding: '20px' } },
        React.createElement("div", null, props.content && Array.isArray(props.content) ?
            props.content.map((c, index) => renderInside(c, index, props)) :
            renderInside(props.content, null, props)),
        React.createElement(Toolbar, { className: classesPage.container, style: { justifyContent: 'space-between', marginTop: '20px' } },
            !prev && React.createElement("span", null),
            prev && (React.createElement(Link, { to: typeof props.activeLang === 'string' ? `/${props.activeLang}${prev.url}` : prev.url, onClick: () => props.toggleOpenId() },
                React.createElement(Tooltip, { placement: "top-start", title: prev.title ? prev.title : 'Previous page' },
                    React.createElement(Button, { variant: "outlined", color: "primary" },
                        React.createElement(ArrowBackIosIcon, { style: { margin: '0 -4px 0 4px' } }))))),
            next && (React.createElement(Link, { to: typeof props.activeLang === 'string' ? `/${props.activeLang}${next.url}` : next.url, onClick: () => props.toggleOpenId() },
                React.createElement(Tooltip, { placement: "top-end", title: next.title ? next.title : 'Next page' },
                    React.createElement(Button, { variant: "outlined", color: "primary" },
                        React.createElement(ArrowForwardIosIcon, null))))),
            !next && React.createElement("span", null))));
});
const Page = (content, props) => React.createElement(InnerPage, Object.assign({ content: content }, props));
export default Page;
