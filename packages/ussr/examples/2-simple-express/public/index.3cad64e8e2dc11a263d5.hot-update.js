/*!
 * banner:
 * example-react-app: 1.0.0
 */
webpackHotUpdate("index",{

/***/ "../../src/Ussr.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UssrContext", function() { return UssrContext; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../src/utils.ts");


const UssrContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])({});

const createUssr = initState => {
  const app = {
    effects: [],
    state: initState
  };

  const addEffect = effect => {
    console.log(effect);
    app.effects.push(effect);
  };

  const runEffects = () => new Promise(resolve => Promise.all(app.effects).then(() => {
    console.log('test');
    resolve(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["clone"])(app.state));
  }));

  return [runEffects, ({
    children
  }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UssrContext.Provider, {
    value: {
      initState,
      addEffect
    }
  }, children)];
};

/* harmony default export */ __webpack_exports__["default"] = (createUssr);

/***/ }),

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
/* harmony import */ var _Ussr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../src/Ussr.tsx");





let first = true;
const useUssrEffect = (path, defaultValue) => {
  const {
    initState,
    addEffect
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_Ussr__WEBPACK_IMPORTED_MODULE_4__["UssrContext"]);

  if (lodash_has__WEBPACK_IMPORTED_MODULE_3___default()(initState, path)) {
    console.warn(`${path} is already exist in InitialState`);
  }

  const _state = lodash_get__WEBPACK_IMPORTED_MODULE_1___default()(initState, path, defaultValue);

  const [state, setState] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_state);

  const _setState = (s, skip) => {
    lodash_set__WEBPACK_IMPORTED_MODULE_2___default()(initState, path, s);

    if (!skip) {
      setState(s);
    }
  };

  return [state, _setState, cb => {
    if (first) {
      //isBackend && typeof cb === 'function' && cb();
      const effect = cb();
      first = false;
      const isEffect = typeof effect.then === 'function';

      if (isEffect) {
        addEffect(effect);
      }
    }
  }];
};

/***/ }),

/***/ "../../src/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Ussr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../src/Ussr.tsx");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../src/hooks.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useUssrEffect", function() { return _hooks__WEBPACK_IMPORTED_MODULE_1__["useUssrEffect"]; });



/* harmony default export */ __webpack_exports__["default"] = (_Ussr__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ })

})
//# sourceMappingURL=index.3cad64e8e2dc11a263d5.hot-update.js.map