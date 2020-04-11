import React, { useEffect, useState } from 'react';
import scrollToElement from 'scroll-to-element';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import MenuItems from '../components/MenuItems';
import MenuBar from '../components/MenuBar';
import Route from '../components/Route';
import Page from '../components/Page';
import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';
// @ts-ignore
const useStyles = makeStyles(styles);
const Layout = (props) => {
    const { hasRoutes } = props;
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    useEffect(() => {
        setTimeout(() => {
            if (document.location.hash.indexOf('#') === 0) {
                scrollToElement(document.location.hash);
            }
        }, 300);
    }, []);
    return (React.createElement("div", { className: `${classes.wrapper} ${!hasRoutes && ' without-routes'}` },
        hasRoutes ? (React.createElement(MenuBar, { handleDrawerToggle: handleDrawerToggle, open: mobileOpen }, isMobile => React.createElement(MenuItems, Object.assign({}, props, { handleDrawerToggle: () => isMobile && handleDrawerToggle() })))) : null,
        React.createElement("div", { className: classes.mainPanel, style: { overflow: 'hidden', maxHeight: 'none' } },
            React.createElement(Header, Object.assign({}, props, { handleDrawerToggle: handleDrawerToggle })),
            React.createElement(Content, null, hasRoutes ? (React.createElement(Route, Object.assign({}, props), routes => Page(routes, props))) : Page(props.docgen, props)),
            React.createElement(Footer, Object.assign({}, props)))));
};
export default Layout;
