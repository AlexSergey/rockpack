"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

require("./assets/styles/index.css");

var _App = _interopRequireDefault(require("./component/App"));

var _registerServiceWorker = _interopRequireDefault(require("./utils/client/registerServiceWorker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom.default.render( /*#__PURE__*/_react.default.createElement(_App.default, null), document.getElementById('root'));

(0, _registerServiceWorker.default)();