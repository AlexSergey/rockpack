import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle';
// @ts-ignore
const useStyles = makeStyles(styles);
const MenuBar = (props) => {
    const classes = useStyles();
    return (React.createElement(React.Fragment, null,
        React.createElement(Hidden, { mdUp: true, implementation: "css" },
            React.createElement(Drawer, { variant: "temporary", open: props.open, classes: {
                    paper: classes.drawerPaper
                }, onClose: props.handleDrawerToggle, ModalProps: {
                    keepMounted: true
                } },
                React.createElement("div", { className: classes.sidebarWrapper, style: {
                        background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
                        color: '#fff',
                        padding: '20px'
                    } }, props.children(true)))),
        React.createElement(Hidden, { smDown: true, implementation: "css" },
            React.createElement(Drawer, { variant: "permanent", open: true, classes: {
                    paper: classes.drawerPaper
                } },
                React.createElement("div", { className: classes.sidebarWrapper, style: {
                        background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
                        color: '#fff',
                        padding: '20px'
                    } }, props.children(false))))));
};
export default MenuBar;
