"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var valid_types_1 = require("valid-types");
var server_1 = require("react-dom/server");
var i18n_1 = __importDefault(require("./i18n"));
var translateSprintf = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return i18n_1["default"].sprintf.apply(i18n_1["default"], args);
};
var translateL = function (text, context) { return (context ?
    i18n_1["default"].pgettext(context, text) :
    i18n_1["default"].gettext(text)); };
var translateNl = function (singular, plural, amount, context) { return (context ?
    i18n_1["default"].npgettext(context, singular, plural, amount) :
    i18n_1["default"].ngettext(singular, plural, amount)); };
var l = function (text, context) { return function () { return translateL(text, context); }; };
exports.l = l;
var nl = function (singular, plural, amount, context) { return function () { return translateNl(singular, plural, amount, context); }; };
exports.nl = nl;
var sprintf = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function () { return (translateSprintf.apply(void 0, args.map(function (item) {
        if (react_1.isValidElement(item)) {
            return server_1.renderToStaticMarkup(item);
        }
        else if (valid_types_1.isFunction(item)) {
            return item();
        }
        return item;
    }))); };
};
exports.sprintf = sprintf;
