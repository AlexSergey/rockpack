"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var scroll_to_element_1 = __importDefault(require("scroll-to-element"));
var styles_1 = require("@material-ui/core/styles");
var Header_1 = __importDefault(require("./Header"));
var Content_1 = __importDefault(require("./Content"));
var Footer_1 = __importDefault(require("./Footer"));
var MenuItems_1 = __importDefault(require("../components/MenuItems"));
var MenuBar_1 = __importDefault(require("../components/MenuBar"));
var Route_1 = __importDefault(require("../components/Route"));
var Page_1 = __importDefault(require("../components/Page"));
var adminStyle_js_1 = __importDefault(require("../assets/jss/material-dashboard-react/layouts/adminStyle.js"));
// @ts-ignore
var useStyles = styles_1.makeStyles(adminStyle_js_1["default"]);
var Layout = function (props) {
    var hasRoutes = props.hasRoutes;
    var classes = useStyles();
    var _a = react_1.useState(false), mobileOpen = _a[0], setMobileOpen = _a[1];
    var handleDrawerToggle = function () {
        setMobileOpen(!mobileOpen);
    };
    react_1.useEffect(function () {
        setTimeout(function () {
            if (document.location.hash.indexOf('#') === 0) {
                scroll_to_element_1["default"](document.location.hash);
            }
        }, 300);
    }, []);
    return (react_1["default"].createElement("div", { className: classes.wrapper + " " + (!hasRoutes && ' without-routes') },
        hasRoutes ? (react_1["default"].createElement(MenuBar_1["default"], { handleDrawerToggle: handleDrawerToggle, open: mobileOpen }, function (isMobile) { return react_1["default"].createElement(MenuItems_1["default"], __assign({}, props, { handleDrawerToggle: function () { return isMobile && handleDrawerToggle(); } })); })) : null,
        react_1["default"].createElement("div", { className: classes.mainPanel, style: { overflow: 'hidden', maxHeight: 'none' } },
            react_1["default"].createElement(Header_1["default"], __assign({}, props, { handleDrawerToggle: handleDrawerToggle })),
            react_1["default"].createElement(Content_1["default"], null, hasRoutes ? (react_1["default"].createElement(Route_1["default"], __assign({}, props), function (routes) { return Page_1["default"](routes, props); })) : Page_1["default"](props.docgen, props)),
            react_1["default"].createElement(Footer_1["default"], __assign({}, props)))));
};
exports["default"] = Layout;
