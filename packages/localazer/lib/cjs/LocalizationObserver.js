"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var valid_types_1 = require("valid-types");
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var i18n_1 = __importDefault(require("./i18n"));
var LocalizationObserver = /** @class */ (function (_super) {
    __extends(LocalizationObserver, _super);
    function LocalizationObserver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalizationObserver.prototype.componentDidMount = function () {
        if (this.props.active !== this.props.defaultLang) {
            this.changeLocalization(this.props.active);
        }
    };
    LocalizationObserver.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.active !== prevProps.active) {
            this.changeLocalization(this.props.active);
        }
    };
    LocalizationObserver.prototype.changeLocalization = function (locale) {
        locale = this.props.languages[locale] ? locale : this.props.defaultLang;
        var localeData = this.props.languages[locale] ? this.props.languages[locale] :
            utils_1.getDefault(this.props.defaultLang, this.props.defaultLocaleData);
        this.updateComponents(localeData, locale);
    };
    LocalizationObserver.prototype.updateComponents = function (localeData, locale) {
        if (localeData && valid_types_1.isObject(localeData.locale_data) && valid_types_1.isObject(localeData.locale_data.messages)) {
            if (valid_types_1.isFunction(this.props.onChange) && valid_types_1.isString(locale)) {
                this.props.onChange(locale);
            }
            i18n_1["default"].options = localeData;
            Object.keys(LocalizationObserver.components)
                .forEach(function (uid) {
                if (valid_types_1.isDefined(LocalizationObserver.components[uid])) {
                    LocalizationObserver.components[uid].forceUpdate();
                }
            });
        }
    };
    LocalizationObserver.prototype.render = function () {
        return this.props.children ? this.props.children : null;
    };
    LocalizationObserver.components = {};
    LocalizationObserver.uid = 0;
    LocalizationObserver.defaultProps = {
        active: constants_1.active,
        defaultLang: constants_1.defaultLang,
        languages: constants_1.languages,
        defaultLocaleData: null
    };
    return LocalizationObserver;
}(react_1.Component));
exports["default"] = LocalizationObserver;
