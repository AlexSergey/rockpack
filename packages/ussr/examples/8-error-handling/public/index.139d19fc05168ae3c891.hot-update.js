/*!
 * banner:
 * example-react-app: 1.0.0
 */
webpackHotUpdate("index",{

/***/ "../../src/hooks.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useUssrEffect", function() { return useUssrEffect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../../../node_modules/lodash/get.js");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../../../node_modules/lodash/set.js");
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_set__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../../../node_modules/lodash/has.js");
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_has__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../src/utils.ts");
/* harmony import */ var _Ussr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../src/Ussr.tsx");






const useUssrEffect = (key, defaultValue) => {
  const initHook = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(true);
  const {
    initState,
    addEffect,
    loading,
    ignoreWillMount
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_Ussr__WEBPACK_IMPORTED_MODULE_5__["UssrContext"]);
  const loaded = !loading;
  const isClient = !Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isBackend"])();
  const setOnTheClient = isClient && loaded && initHook.current;

  if (setOnTheClient && lodash_has__WEBPACK_IMPORTED_MODULE_3___default()(initState, key) && "development" !== 'production') {
    /* eslint-disable no-console */
    console.error('key should be unique!');
    /* eslint-disable no-console */

    console.error(`The key "${key}" is already exist in InitialState`);
  }

  const appStateFragment = lodash_get__WEBPACK_IMPORTED_MODULE_1___default()(initState, key, defaultValue);
  const [state, _setState] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(appStateFragment);

  const setState = (componentState, skip) => {
    lodash_set__WEBPACK_IMPORTED_MODULE_2___default()(initState, key, componentState);

    if (!skip) {
      _setState(componentState);
    }
  };

  const willMount = cb => {
    if (ignoreWillMount) {
      return;
    }

    const onLoadOnTheClient = isClient && initHook.current && typeof cb === 'function';
    const onLoadOnTheBackend = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isBackend"])() && typeof cb === 'function';
    initHook.current = false;

    if (onLoadOnTheClient) {
      cb();
    } else if (onLoadOnTheBackend) {
      const effect = cb();
      const isEffect = typeof effect.then === 'function';

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isBackend"])() && isEffect) {
        addEffect(effect);
      }
    }
  };

  return [state, setState, willMount];
};

/***/ }),

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

/***/ })

})
//# sourceMappingURL=index.139d19fc05168ae3c891.hot-update.js.map