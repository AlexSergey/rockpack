(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["Home"],{

/***/ "./src/Home.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../src/index.ts");
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/effect.js");





const Home = () => {
  const [state, setState, willMount] = Object(_src__WEBPACK_IMPORTED_MODULE_2__["useUssrEffect"])('appState.test', {
    test: 'i am test '
  });
  willMount(() => Object(_effect__WEBPACK_IMPORTED_MODULE_3__["effect"])().then(data => setState(data)));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, state.test), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    to: "/secondary"
  }, "secondary")));
};

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ }),

/***/ "./src/effect.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effect", function() { return effect; });
const effect = () => {
  return new Promise(resolve => setTimeout(() => resolve({
    test: 'data'
  }), 1000));
};

/***/ })

}]);
//# sourceMappingURL=Home.js.map