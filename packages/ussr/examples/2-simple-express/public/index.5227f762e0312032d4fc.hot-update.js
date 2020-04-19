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

const OnComplete = ({
  init,
  setInitState
}) => {
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (init) {
      setInitState(false);
    }
  }, []);
  return null;
};

const createUssr = initState => {
  const app = {
    effects: [],
    state: initState
  };

  const addEffect = effect => {
    app.effects.push(effect);
  };

  const runEffects = () => new Promise(resolve => Promise.all(app.effects).then(() => {
    resolve(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["clone"])(app.state));
  }));

  return [runEffects, ({
    children
  }) => {
    const [init, setInitState] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UssrContext.Provider, {
      value: {
        init,
        initState,
        addEffect
      }
    }, children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OnComplete, {
      init: init,
      setInitState: setInitState
    }));
  }];
};

/* harmony default export */ __webpack_exports__["default"] = (createUssr);

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
//# sourceMappingURL=index.5227f762e0312032d4fc.hot-update.js.map