import React, { isValidElement } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Menu from '@material-ui/icons/Menu';
import GitHub from '@material-ui/icons/GitHub';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
// @ts-ignore
const useStylesHeader = makeStyles(stylesHeader);
const Header = (props) => {
    const classesHeader = useStylesHeader();
    const appBarClasses = classNames({
        [`${classesHeader[props.color]}`]: props.color
    });
    return (React.createElement(AppBar, { className: classesHeader.appBar + appBarClasses, style: { height: '75px' } },
        React.createElement(Toolbar, { className: classesHeader.container, style: { height: '100%' } },
            props.logo && (React.createElement(Hidden, { smDown: true, implementation: "css", 
                // @ts-ignore
                className: "wrapper-logo" },
                React.createElement("div", { style: { height: '100%', padding: '0 20px 0' } }, typeof props.logo === 'string' && (React.createElement("img", { src: props.logo, alt: typeof props.logoAlt || '', style: {
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100px'
                    } }))))),
            React.createElement("div", { className: classesHeader.flex }, props.title || 'Documentation'),
            props.isLocalized ? (React.createElement("div", { style: { padding: '0 20px 0' } },
                React.createElement(Select, { labelId: "demo-simple-select-label", id: "demo-simple-select", value: props.activeLang, onChange: (e) => {
                        if (typeof e.target.value === 'string') {
                            props.changeLocal(e.target.value);
                        }
                    } }, Object.keys(props.localization)
                    .map(code => {
                    if (typeof props.localization[code] && isValidElement(props.localization[code].component)) {
                        return (React.createElement(MenuItem, { value: code, key: code }, props.localization[code].component));
                    }
                    return (React.createElement(MenuItem, { value: code, key: code }, code));
                })))) : null,
            props.github ? (React.createElement("div", { style: { padding: '0 20px 0 0' } },
                React.createElement("a", { href: props.github, target: "_blank", rel: "noopener noreferrer" },
                    React.createElement(GitHub, null)))) : null,
            React.createElement(Hidden, { mdUp: true, implementation: "css" },
                React.createElement(IconButton, { color: "inherit", "aria-label": "open drawer", onClick: props.handleDrawerToggle },
                    React.createElement(Menu, null))))));
};
export default Header;
