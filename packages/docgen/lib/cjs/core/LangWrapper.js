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
var localazer_1 = require("@rock/localazer");
var react_router_dom_1 = require("react-router-dom");
var valid_types_1 = require("valid-types");
var parseLanguageFromUrl_1 = __importDefault(require("../utils/parseLanguageFromUrl"));
var Wrapper = function (_a) {
    var children = _a.children;
    return children;
};
exports.LangWrapper = react_router_dom_1.withRouter(function (props) {
    var isLocalized = valid_types_1.isObject(props.localization);
    var LocalizationWrapper = isLocalized ? localazer_1.LocalizationObserver : Wrapper;
    var activeLanguage;
    if (isLocalized) {
        activeLanguage = parseLanguageFromUrl_1["default"](document.location.pathname, Object.keys(props.localization));
        if (!activeLanguage && Object.keys(props.localization).length > 0) {
            var lang = localazer_1.detectLanguage();
            var langs = Array.isArray(lang) ? lang : [lang];
            var defaultLang = langs.map(function (e) { return (e.indexOf('-') ? e.split('-')[0] : e); })[0];
            if (props.localization && props.localization[defaultLang]) {
                activeLanguage = defaultLang;
            }
            else if (props.localization) {
                activeLanguage = Object.keys(props.localization)[0];
            }
        }
    }
    if (!valid_types_1.isString(activeLanguage)) {
        return (react_1["default"].createElement(Wrapper, null, props.children()));
    }
    var _a = react_1.useState(activeLanguage), languageState = _a[0], localization = _a[1];
    var languages = Object.keys(props.localization)
        .reduce(function (a, b) {
        a[b] = props.localization[b].language ? props.localization[b].language : props.localization[b];
        return a;
    }, {});
    return (react_1["default"].createElement(LocalizationWrapper, __assign({}, Object.assign({}, isLocalized ? {
        languages: languages,
        active: activeLanguage
    } : {})), props.children(isLocalized, languageState, function (lang) {
        var newUrl = valid_types_1.isString(activeLanguage) ?
            document.location.pathname.replace("/" + activeLanguage, "/" + lang) :
            false;
        if (typeof newUrl === 'string') {
            props.history.push(newUrl);
        }
        if (props.localization[lang]) {
            localization(lang);
        }
        else {
            console.warn("Can't set language " + lang + ". This language not available in localization config");
        }
    })));
});
