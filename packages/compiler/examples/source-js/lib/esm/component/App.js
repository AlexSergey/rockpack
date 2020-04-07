var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

import React, { Component } from 'react';
import logo from '../assets/styles/logo.svg';
import './App.css';
const logoData = `data:image/svg+xml;base64,${window.btoa(logo)}`;

var _ref =
/*#__PURE__*/
_jsx("div", {
  className: "App"
}, void 0, _jsx("header", {
  className: "App-header"
}, void 0, _jsx("img", {
  src: logoData,
  className: "App-logo",
  alt: "logo"
}), _jsx("h1", {
  className: "App-title"
}, void 0, "Welcome to React")), _jsx("p", {
  className: "App-intro"
}, void 0, "To get started, edit ", _jsx("code", {}, void 0, "src/App.js"), " and save to reload."));

class App extends Component {
  render() {
    return _ref;
  }

}

export default App;