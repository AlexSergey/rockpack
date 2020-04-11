"use strict";
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
var react_meta_tags_1 = __importDefault(require("react-meta-tags"));
var valid_types_1 = require("valid-types");
var tracker_1 = __importDefault(require("../utils/tracker"));
var _Route = function (props) {
    var TreeRouteRender = function (route, output, prefix) {
        if (!route) {
            return output;
        }
        if (Array.isArray(route)) {
            route.map(function (s) { return TreeRouteRender(s, output, prefix); });
            return output;
        }
        if (!route.url) {
            output.push(function () { return props.children(route); });
            return output;
        }
        var renderInAnotherRoute = [];
        var renderInside = [];
        renderInside.push(route);
        if (route.children) {
            (Array.isArray(route.children) ? route.children : [route.children]).forEach(function (r) {
                if (!r.url) {
                    renderInside.push(r);
                }
                else {
                    renderInAnotherRoute.push(r);
                }
            });
        }
        output.push(react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: typeof prefix === 'string' ? "/" + prefix + route.url : route.url, component: function () { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                route.meta && (react_1["default"].createElement(react_meta_tags_1["default"], null, react_1.isValidElement(route.meta) ?
                    route.meta :
                    (Array.isArray(route.meta) ?
                        route.meta.map(function (m, index) { return (react_1.isValidElement(m) ?
                            react_1.cloneElement(m, { key: index }) :
                            null); }) :
                        null))),
                valid_types_1.isString(props.ga) ?
                    tracker_1["default"](props.children(renderInside)) :
                    props.children(renderInside))); } }));
        if (renderInAnotherRoute.length > 0) {
            renderInAnotherRoute.map(function (r) { return TreeRouteRender(r, output, prefix); });
        }
        return output;
    };
    return (react_1["default"].createElement(react_router_dom_1.Switch, null,
        props.isLocalized && Array.isArray(props.languages) ?
            props.languages.map(function (lang) { return (TreeRouteRender(props.docgen, [], lang)
                .map(function (route, index) { return react_1.isValidElement(route) && react_1.cloneElement(route, { key: index }); })); }) : (TreeRouteRender(props.docgen, [])
            .map(function (route, index) { return react_1.isValidElement(route) && react_1.cloneElement(route, { key: index }); })),
        props.isLocalized && Array.isArray(props.languages) ?
            react_1["default"].createElement(react_router_dom_1.Redirect, { from: "/", to: "/" + props.activeLang }) :
            react_1["default"].createElement(react_router_dom_1.Redirect, { from: "/", to: "/" })));
};
exports["default"] = _Route;
