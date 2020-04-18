"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var get_1 = __importDefault(require("lodash/get"));
var set_1 = __importDefault(require("lodash/set"));
var has_1 = __importDefault(require("lodash/has"));
var utils_1 = require("./utils");
var Ussr_1 = require("./Ussr");
exports.useUssrEffect = function (key, defaultValue) {
    var initHook = react_1.useRef(true);
    var _a = react_1.useContext(Ussr_1.UssrContext), initState = _a.initState, addEffect = _a.addEffect, loading = _a.loading;
    var loaded = !loading;
    var isClient = !utils_1.isBackend();
    var setOnTheClient = isClient && loaded && initHook.current;
    if (setOnTheClient && has_1["default"](initState, key) && process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.error('key should be unique!');
        /* eslint-disable no-console */
        console.error("The key \"" + key + "\" is already exist in InitialState");
    }
    var appStateFragment = get_1["default"](initState, key, defaultValue);
    var _b = react_1.useState(appStateFragment), state = _b[0], _setState = _b[1];
    var setState = function (componentState, skip) {
        set_1["default"](initState, key, componentState);
        if (!skip) {
            _setState(componentState);
        }
    };
    var willMount = function (cb) {
        var onLoadOnTheClient = isClient && initHook.current && typeof cb === 'function';
        var onLoadOnTheBackend = utils_1.isBackend() && typeof cb === 'function';
        initHook.current = false;
        if (onLoadOnTheClient) {
            cb();
        }
        else if (onLoadOnTheBackend) {
            var effect = cb();
            var isEffect = typeof effect.then === 'function';
            if (utils_1.isBackend() && isEffect) {
                addEffect(effect);
            }
        }
    };
    return [
        state,
        setState,
        willMount
    ];
};
