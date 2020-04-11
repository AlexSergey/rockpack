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
var react_1 = __importDefault(require("react"));
var react_2 = require("@mdx-js/react");
var unified_ui_1 = require("unified-ui");
var CodeBlock_1 = __importDefault(require("./CodeBlock"));
var Style = function (_a) {
    var children = _a.children;
    return (react_1["default"].createElement("style", { dangerouslySetInnerHTML: {
            __html: children
        } }));
};
var defaultComponents = {
    code: CodeBlock_1["default"]
};
var MDXLayout = function (props) { return (react_1["default"].createElement(react_2.MDXProvider, { components: Object.assign({}, defaultComponents, props.components), className: "mdx-provider" },
    react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Style, null, unified_ui_1.baseStyles),
        react_1["default"].createElement(unified_ui_1.Container, __assign({}, props))))); };
exports["default"] = MDXLayout;
