"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _logo = _interopRequireDefault(require("../assets/styles/logo.svg"));

require("./App.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const logoData = `data:image/svg+xml;base64,${window.btoa(_logo.default)}`;

class App extends _react.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "App"
    }, /*#__PURE__*/_react.default.createElement("header", {
      className: "App-header"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: logoData,
      className: "App-logo",
      alt: "logo"
    }), /*#__PURE__*/_react.default.createElement("h1", {
      className: "App-title"
    }, "Welcome to React")), /*#__PURE__*/_react.default.createElement("p", {
      className: "App-intro"
    }, "To get started, edit ", /*#__PURE__*/_react.default.createElement("code", null, "src/App.js"), " and save to reload."));
  }

}

var _default = App;
exports.default = _default;