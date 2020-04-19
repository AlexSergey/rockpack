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
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../src/index.ts");




const effect = () => {
  return new Promise(resolve => setTimeout(() => resolve({
    test: 'data'
  }), 1000));
};

const Home = () => {
  console.log('Home');
  const [state, setState, willMount] = Object(_src__WEBPACK_IMPORTED_MODULE_2__["useUssrEffect"])('appState.test', {
    test: 'i am test '
  });
  willMount(() => effect().then(data => setState(data)));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, state.test), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    to: "/secondary"
  }, "secondary"));
};

const Secondary = () => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Secondary"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
  to: "/"
}, "Home"));

const App = () => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/secondary",
  component: Secondary
}), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/",
  component: Home,
  exact: true
}));

/***/ })

})
//# sourceMappingURL=index.ff6ab594601d00f7f6db.hot-update.js.map