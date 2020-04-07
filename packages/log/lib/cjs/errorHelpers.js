"use strict";
exports.__esModule = true;
exports.mixParams = function (props, skipHref) {
    if (props === void 0) { props = {}; }
    if (skipHref) {
        return Object.assign({}, props);
    }
    var href = globalThis && globalThis.location && globalThis.location.href ? globalThis.location.href : '';
    return Object.assign({}, href !== '' ? { url: href } : {}, props);
};
exports.serializeError = function (stack, lineNumber) {
    var alt = {
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
    var critical = {};
    critical[CRITICAL] = exports.serializeError(trace, lineNumber);
    return exports.mixParams(critical, true);
};
