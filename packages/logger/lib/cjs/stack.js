"use strict";
exports.__esModule = true;
var valid_types_1 = require("valid-types");
var utils_1 = require("./utils");
var errorHelpers_1 = require("./errorHelpers");
var getStackData = function (stack, stackCollection, props) {
    var lang = globalThis.navigator && globalThis.navigator.languages && valid_types_1.isArray(globalThis.navigator.languages) ?
        globalThis.navigator.languages[0] :
        '';
    var href = globalThis.location && globalThis.location.href ? globalThis.location.href : '';
    var actions = stackCollection.getData();
    stack.session.end = valid_types_1.isFunction(props.getCurrentDate) ? props.getCurrentDate() : utils_1.getCurrentDate();
    stack.actions = actions;
    stack.env.lang = lang;
    stack.env.href = href;
    if (valid_types_1.isFunction(props.onPrepareStack)) {
        props.onPrepareStack(stack);
    }
    return utils_1.clone(stack);
};
exports.getStackData = getStackData;
// eslint-disable-next-line max-len
var onCriticalError = function (stack, stackCollection, props, trace, lineNumber) {
    stackCollection.add(errorHelpers_1.createCritical(trace, lineNumber));
    return getStackData(stack, stackCollection, props);
};
exports.onCriticalError = onCriticalError;
