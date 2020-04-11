"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var Hidden_1 = __importDefault(require("@material-ui/core/Hidden"));
var Drawer_1 = __importDefault(require("@material-ui/core/Drawer"));
var styles_1 = require("@material-ui/core/styles");
var sidebarStyle_1 = __importDefault(require("../assets/jss/material-dashboard-react/components/sidebarStyle"));
// @ts-ignore
var useStyles = styles_1.makeStyles(sidebarStyle_1["default"]);
var MenuBar = function (props) {
    var classes = useStyles();
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Hidden_1["default"], { mdUp: true, implementation: "css" },
            react_1["default"].createElement(Drawer_1["default"], { variant: "temporary", open: props.open, classes: {
                    paper: classes.drawerPaper
                }, onClose: props.handleDrawerToggle, ModalProps: {
                    keepMounted: true
                } },
                react_1["default"].createElement("div", { className: classes.sidebarWrapper, style: {
                        background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
                        color: '#fff',
                        padding: '20px'
                    } }, props.children(true)))),
        react_1["default"].createElement(Hidden_1["default"], { smDown: true, implementation: "css" },
            react_1["default"].createElement(Drawer_1["default"], { variant: "permanent", open: true, classes: {
                    paper: classes.drawerPaper
                } },
                react_1["default"].createElement("div", { className: classes.sidebarWrapper, style: {
                        background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
                        color: '#fff',
                        padding: '20px'
                    } }, props.children(false))))));
};
exports["default"] = MenuBar;
