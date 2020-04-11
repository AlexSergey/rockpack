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
var react_router_dom_1 = require("react-router-dom");
var Paper_1 = __importDefault(require("@material-ui/core/Paper"));
var core_1 = require("@material-ui/core");
var Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
var Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var ArrowBackIos_1 = __importDefault(require("@material-ui/icons/ArrowBackIos"));
var ArrowForwardIos_1 = __importDefault(require("@material-ui/icons/ArrowForwardIos"));
var headerStyle_1 = __importDefault(require("../assets/jss/material-dashboard-react/components/headerStyle"));
var findRoutes_1 = __importDefault(require("../utils/findRoutes"));
var MDXLayout_1 = __importDefault(require("./MDXLayout"));
// @ts-ignore
var useStylesPage = core_1.makeStyles(headerStyle_1["default"]);
var renderInside = function (content, index, props) {
    if (!content) {
        return null;
    }
    var component = null;
    if (react_1.isValidElement(content)) {
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
    var name = content.name;
    var title = content.title;
    var opt = {
        key: null,
        id: null
    };
    if (typeof index === 'number') {
        opt.key = index;
    }
    if (typeof name === 'string') {
        opt.id = name;
    }
    var block = (component && component.isMDXComponent ? (react_1["default"].createElement(MDXLayout_1["default"], __assign({ key: index }, props), react_1.createElement(component))) :
        react_1.isValidElement(component) ?
            component :
            typeof component === 'function' ?
                component() :
                component);
    return (react_1["default"].createElement("div", __assign({}, Object.assign({}, opt)),
        title && react_1["default"].createElement("h2", null, title),
        block));
};
var InnerPage = react_router_dom_1.withRouter(function (props) {
    var classesPage = useStylesPage();
    var current = typeof props.activeLang === 'string' ?
        props.match.path.replace("/" + props.activeLang, '') :
        props.match.path;
    var _a = findRoutes_1["default"](current, props.docgen), prev = _a.prev, next = _a.next;
    return (react_1["default"].createElement(Paper_1["default"], { style: { padding: '20px' } },
        react_1["default"].createElement("div", null, props.content && Array.isArray(props.content) ?
            props.content.map(function (c, index) { return renderInside(c, index, props); }) :
            renderInside(props.content, null, props)),
        react_1["default"].createElement(Toolbar_1["default"], { className: classesPage.container, style: { justifyContent: 'space-between', marginTop: '20px' } },
            !prev && react_1["default"].createElement("span", null),
            prev && (react_1["default"].createElement(react_router_dom_1.Link, { to: typeof props.activeLang === 'string' ? "/" + props.activeLang + prev.url : prev.url, onClick: function () { return props.toggleOpenId(); } },
                react_1["default"].createElement(Tooltip_1["default"], { placement: "top-start", title: prev.title ? prev.title : 'Previous page' },
                    react_1["default"].createElement(Button_1["default"], { variant: "outlined", color: "primary" },
                        react_1["default"].createElement(ArrowBackIos_1["default"], { style: { margin: '0 -4px 0 4px' } }))))),
            next && (react_1["default"].createElement(react_router_dom_1.Link, { to: typeof props.activeLang === 'string' ? "/" + props.activeLang + next.url : next.url, onClick: function () { return props.toggleOpenId(); } },
                react_1["default"].createElement(Tooltip_1["default"], { placement: "top-end", title: next.title ? next.title : 'Next page' },
                    react_1["default"].createElement(Button_1["default"], { variant: "outlined", color: "primary" },
                        react_1["default"].createElement(ArrowForwardIos_1["default"], null))))),
            !next && react_1["default"].createElement("span", null))));
});
var Page = function (content, props) { return react_1["default"].createElement(InnerPage, __assign({ content: content }, props)); };
exports["default"] = Page;
