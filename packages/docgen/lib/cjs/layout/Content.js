"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var core_1 = require("@material-ui/core");
var adminStyle_1 = __importDefault(require("../assets/jss/material-dashboard-react/layouts/adminStyle"));
// @ts-ignore
var useStylesContent = core_1.makeStyles(adminStyle_1["default"]);
var Content = function (_a) {
    var children = _a.children;
    var classesContent = useStylesContent();
    return (react_1["default"].createElement("div", { className: classesContent.content, style: { minHeight: 'auto', float: 'left', width: '100%' } },
        react_1["default"].createElement("div", { className: classesContent.container }, children)));
};
exports["default"] = Content;
