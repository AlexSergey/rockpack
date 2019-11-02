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
import React, { Component } from 'react';
export function colorMiddleware(color) {
    return color;
}
var ColorString = /** @class */ (function (_super) {
    __extends(ColorString, _super);
    function ColorString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorString.prototype.render = function () {
        return React.createElement("p", { style: { backgroundColor: colorMiddleware(this.props.color) } }, "Hello world");
    };
    return ColorString;
}(Component));
export default ColorString;
