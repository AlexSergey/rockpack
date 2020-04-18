"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var get_1 = __importDefault(require("lodash/get"));
var set_1 = __importDefault(require("lodash/set"));
var Ussr_1 = require("./Ussr");
var first = true;
exports.useUssrEffect = function (path, defaultValue) {
    var _a = react_1.useContext(Ussr_1.UssrContext), initState = _a.initState, addEffect = _a.addEffect;
    var _state = get_1["default"](initState, path, defaultValue);
    var _b = react_1.useState(_state), state = _b[0], setState = _b[1];
    var _setState = function (s, skip) {
        set_1["default"](initState, path, s);
        if (!skip) {
            setState(s);
        }
    };
    return [
        state,
        _setState,
        function (cb) {
            if (first) {
                //isBackend && typeof cb === 'function' && cb();
                var effect = cb();
                first = false;
                var isEffect = typeof effect.then === 'function';
                if (isEffect) {
                    addEffect(effect);
                }
            }
        }
    ];
};
