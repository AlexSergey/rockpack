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
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../src/server.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "serverRender", function() { return _server__WEBPACK_IMPORTED_MODULE_1__["serverRender"]; });

/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../src/hooks.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useUssrEffect", function() { return _hooks__WEBPACK_IMPORTED_MODULE_2__["useUssrEffect"]; });




/* harmony default export */ __webpack_exports__["default"] = (_Ussr__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "../../src/server.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serverRender", function() { return serverRender; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react-dom/server.browser.js");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Ussr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../src/Ussr.tsx");



const serverRender = async ({
  render
}) => {
  const [runEffects, UssrRunEffects] = Object(_Ussr__WEBPACK_IMPORTED_MODULE_2__["default"])({});
  Object(react_dom_server__WEBPACK_IMPORTED_MODULE_1__["renderToString"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UssrRunEffects, null, render()));
  const state = await runEffects();
  const [, Ussr] = Object(_Ussr__WEBPACK_IMPORTED_MODULE_2__["default"])(state, true);
  const html = Object(react_dom_server__WEBPACK_IMPORTED_MODULE_1__["renderToString"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Ussr, null, render()));
  return {
    html,
    state
  };
};

/***/ })

})
//# sourceMappingURL=index.35e0b5bb6aa04d70028f.hot-update.js.map