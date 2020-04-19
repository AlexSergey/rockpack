/*!
 * banner:
 * example-react-app: 1.0.0
 */
webpackHotUpdate("index",{

/***/ "../../src/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Ussr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../src/Ussr.tsx");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../src/hooks.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useUssrEffect", function() { return _hooks__WEBPACK_IMPORTED_MODULE_1__["useUssrEffect"]; });



/* harmony default export */ __webpack_exports__["default"] = (_Ussr__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/App.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../src/index.ts");



const effect = () => {
  console.log('run effect');
  return new Promise(resolve => setTimeout(() => resolve({
    test: 'data'
  }), 1000));
};

const App = () => {
  const [state, setState, runEffect] = Object(_src__WEBPACK_IMPORTED_MODULE_1__["useUssrEffect"])('appState.test', {
    test: 'i am test '
  });
  runEffect(() => effect().then(data => setState(data)));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, state.test));
};

/***/ })

})
//# sourceMappingURL=index.fd3836c77d8e63edced8.hot-update.js.map