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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var renderText_1 = __importDefault(require("./renderText"));
function colorMiddleware(color) {
    return color;
}
exports.colorMiddleware = colorMiddleware;
var ColorString = /** @class */ (function (_super) {
    __extends(ColorString, _super);
    function ColorString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorString.prototype.render = function () {
        return react_1.default.createElement("p", { style: { backgroundColor: colorMiddleware(this.props.color) } }, renderText_1.default());
    };
    return ColorString;
}(react_1.Component));
exports.default = ColorString;
