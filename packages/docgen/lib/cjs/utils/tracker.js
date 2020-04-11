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
var react_1 = require("react");
var react_ga_1 = __importDefault(require("react-ga"));
var react_router_1 = require("react-router");
var withTracker = function (WrappedComponent, options) {
    if (options === void 0) { options = {}; }
    var trackPage = function (page) {
        react_ga_1["default"].set(__assign({ page: page }, options));
        react_ga_1["default"].pageview(page);
    };
    var HOC = react_router_1.withRouter(function (props) {
        react_1.useEffect(function () { return trackPage(props.location.pathname); }, [
            props.location.pathname
        ]);
        return WrappedComponent;
    });
    return react_1.createElement(HOC);
};
exports["default"] = withTracker;
