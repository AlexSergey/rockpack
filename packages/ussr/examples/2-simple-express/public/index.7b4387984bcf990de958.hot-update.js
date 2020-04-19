/*!
 * banner:
 * example-react-app: 1.0.0
 */
webpackHotUpdate("index",{

/***/ "./src/App.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../dist/index.js");
/* harmony import */ var _dist__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_dist__WEBPACK_IMPORTED_MODULE_1__);



const effect = () => new Promise(resolve => setTimeout(() => resolve({
  test: 'data'
}), 1000));

const App = () => {
  const [state, setState, runEffect] = Object(_dist__WEBPACK_IMPORTED_MODULE_1__["useUssrEffect"])('appState.test', {
    test: 'i am test '
  });
  runEffect(() => effect().then(data => setState(data)));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, state.test));
};

/***/ })

})
//# sourceMappingURL=index.7b4387984bcf990de958.hot-update.js.map