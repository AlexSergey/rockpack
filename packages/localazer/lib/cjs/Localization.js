"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var valid_types_1 = require("valid-types");
var LocalizationObserver_1 = __importDefault(require("./LocalizationObserver"));
var Localization = /** @class */ (function (_super) {
    __extends(Localization, _super);
    function Localization(props) {
        var _this = _super.call(this, props) || this;
        _this.id = ++LocalizationObserver_1["default"].uid;
        LocalizationObserver_1["default"].components[_this.id] = _this;
        return _this;
    }
    Localization.prototype.componentWillUnmount = function () {
        delete LocalizationObserver_1["default"].components[this.id];
    };
    Localization.prototype.render = function () {
        return valid_types_1.isFunction(this.props.children) ? (react_1["default"].createElement("span", { className: "localization-node " + (valid_types_1.isString(this.props.className) ? this.props.className : ''), dangerouslySetInnerHTML: { __html: this.props.children() } })) : null;
    };
    return Localization;
}(react_1.Component));
exports["default"] = Localization;
