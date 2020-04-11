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
var Footer = function (_a) {
    var footer = _a.footer;
    return (react_1.isValidElement(footer) ? (react_1["default"].createElement("div", { style: { padding: '0 20px 20px', textAlign: 'center' } }, footer)) : null);
};
exports["default"] = Footer;
