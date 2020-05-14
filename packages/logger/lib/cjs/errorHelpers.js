"use strict";
exports.__esModule = true;
var types_1 = require("./types");
exports.mixUrl = function (props) {
    var href = globalThis && globalThis.location && globalThis.location.href ? globalThis.location.href : '';
    return Object.assign({}, href !== '' ? { url: href } : {}, props);
};
exports.serializeError = function (stack, lineNumber) {
    var alt = {
        stack: [],
        message: '',
        line: lineNumber
    };
    Object.getOwnPropertyNames(stack).forEach(function (key) {
        if (key === 'stack') {
            alt[key] = stack[key].split('\n');
        }
        else {
            alt[key] = stack[key];
        }
    }, stack);
    return alt;
};
var CRITICAL = 'critical';
exports.isCritical = function (type) { return CRITICAL === type; };
exports.getCritical = function () { return CRITICAL; };
exports.createCritical = function (trace, lineNumber) {
    var _a;
    var criticalError = exports.serializeError(trace, lineNumber);
    return _a = {},
        _a[CRITICAL] = exports.mixUrl(criticalError),
        _a;
};
