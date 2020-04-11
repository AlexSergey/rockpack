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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var react_ga_1 = __importDefault(require("react-ga"));
var valid_types_1 = require("valid-types");
var history_1 = require("history");
var react_router_dom_1 = require("react-router-dom");
var layout_1 = __importDefault(require("../layout"));
var findPathToActiveRoute_1 = __importDefault(require("../utils/findPathToActiveRoute"));
var openIdGenerate_1 = __importDefault(require("../utils/openIdGenerate"));
var mergeUrls_1 = __importDefault(require("../utils/mergeUrls"));
var validation_1 = __importDefault(require("../utils/validation"));
var LangWrapper_1 = require("./LangWrapper");
var OpenIds_1 = require("./OpenIds");
var history = history_1.createBrowserHistory();
exports.createDocumentation = function (props, el) {
    if (!(el instanceof HTMLElement)) {
        console.error('DOM element is invalid');
        return false;
    }
    var isValid = validation_1["default"](props);
    if (!isValid) {
        console.error('props is invalid');
        return false;
    }
    var hasRoutes = Array.isArray(props.docgen);
    if (hasRoutes) {
        mergeUrls_1["default"](props.docgen);
    }
    var allOpened = hasRoutes ? openIdGenerate_1["default"](props.docgen, []) : [];
    var openIds = [];
    openIds = allOpened;
    var found = false;
    if (valid_types_1.isString(props.ga)) {
        react_ga_1["default"].initialize(props.ga);
    }
    if (Array.isArray(props.docgen)) {
        props.docgen.forEach(function (section) {
            var pathToRoute = findPathToActiveRoute_1["default"](document.location.pathname, section, []);
            if (pathToRoute.length > 0) {
                if (!found) {
                    openIds = pathToRoute;
                    found = true;
                }
                setTimeout(function () {
                    var activeElement = document.getElementById(pathToRoute[pathToRoute.length - 1]);
                    if (activeElement) {
                        activeElement.scrollIntoView();
                    }
                }, 300);
            }
        });
    }
    var languages = valid_types_1.isObject(props.localization) ? Object.keys(props.localization) : false;
    var handleOpen = function (setOpenIds) {
        setTimeout(function () {
            var found = false;
            if (Array.isArray(props.docgen)) {
                props.docgen.forEach(function (section) {
                    var pathToRoute = findPathToActiveRoute_1["default"](document.location.pathname, section, []);
                    if (pathToRoute.length > 0) {
                        if (!found) {
                            setOpenIds(pathToRoute);
                            setTimeout(function () {
                                var activeElement = document.getElementById(pathToRoute[pathToRoute.length - 1]);
                                if (activeElement) {
                                    activeElement.scrollIntoView();
                                }
                            }, 300);
                            found = true;
                        }
                    }
                });
            }
        });
    };
    react_dom_1.render((react_1["default"].createElement(react_router_dom_1.Router, { history: history },
        react_1["default"].createElement(LangWrapper_1.LangWrapper, __assign({}, props), function (isLocalized, activeLang, changeLocal) { return (react_1["default"].createElement(OpenIds_1.OpenIds, __assign({}, props, { openIds: openIds }), function (openIds, setOpenIds) { return (react_1["default"].createElement(layout_1["default"], __assign({}, Object.assign({}, props, {
            openIds: openIds,
            hasRoutes: hasRoutes,
            isLocalized: isLocalized,
            activeLang: activeLang,
            changeLocal: changeLocal,
            languages: languages,
            toggleOpenId: function () {
                handleOpen(setOpenIds);
            }
        })))); })); }))), el);
};
