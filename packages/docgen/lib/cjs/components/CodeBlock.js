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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var prism_react_renderer_1 = __importStar(require("prism-react-renderer"));
var react_live_1 = require("react-live");
var react_2 = require("@mdx-js/react");
var CodeBlock = function (_a) {
    var children = _a.children, className = _a.className, live = _a.live, render = _a.render;
    var language = typeof className === 'string' && className.indexOf('language') > 0 ?
        className.replace(/language-/, '') :
        'jsx';
    if (live) {
        return (react_1["default"].createElement("div", { style: {
                backgroundColor: 'rgb(42, 39, 52)',
                caretColor: 'white'
            } },
            react_1["default"].createElement(react_live_1.LiveProvider, { code: children.trim(), transformCode: function (code) { return "/** @jsx mdx */" + code; }, scope: { mdx: react_2.mdx } },
                react_1["default"].createElement(react_live_1.LivePreview, null),
                react_1["default"].createElement(react_live_1.LiveEditor, null),
                react_1["default"].createElement("div", { style: { color: 'white' } },
                    react_1["default"].createElement(react_live_1.LiveError, null)))));
    }
    if (render) {
        return (react_1["default"].createElement("div", null,
            react_1["default"].createElement(react_live_1.LiveProvider, { code: children },
                react_1["default"].createElement(react_live_1.LivePreview, null))));
    }
    return (react_1["default"].createElement(prism_react_renderer_1["default"], __assign({}, prism_react_renderer_1.defaultProps, { code: children.trim(), language: language }), function (_a) {
        var className = _a.className, style = _a.style, tokens = _a.tokens, getLineProps = _a.getLineProps, getTokenProps = _a.getTokenProps;
        return (react_1["default"].createElement("pre", { className: className, style: __assign(__assign({}, style), { padding: '20px', overflow: 'auto' }) }, tokens.map(function (line, i) { return (react_1["default"].createElement("div", __assign({ key: i }, getLineProps({ line: line, key: i })), line.map(function (token, key) { return (react_1["default"].createElement("span", __assign({ key: key }, getTokenProps({ token: token, key: key })))); }))); })));
    }));
};
exports["default"] = CodeBlock;
