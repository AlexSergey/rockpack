"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var utils_1 = require("./utils");
exports.UssrContext = react_1.createContext({});
var OnComplete = function (_a) {
    var loading = _a.loading, onLoad = _a.onLoad;
    react_1.useEffect(function () {
        if (!utils_1.isBackend() && loading) {
            onLoad(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};
var createUssr = function (initState) {
    var app = {
        effects: [],
        state: initState
    };
    var addEffect = function (effect) {
        app.effects.push(effect);
    };
    var runEffects = function () { return new Promise(function (resolve) { return (Promise.all(app.effects)
        .then(function () { return resolve(utils_1.clone(app.state)); })); }); };
    return [runEffects, function (_a) {
            var children = _a.children;
            var _b = react_1.useState(!utils_1.isBackend()), loading = _b[0], onLoad = _b[1];
            return (react_1["default"].createElement(exports.UssrContext.Provider, { value: {
                    loading: loading,
                    initState: initState,
                    addEffect: addEffect
                } },
                children,
                react_1["default"].createElement(OnComplete, { loading: loading, onLoad: onLoad })));
        }];
};
exports["default"] = createUssr;
