import React, { Component } from 'react';
import logo from '../assets/styles/logo.svg';
import './App.css';
const logoData = `data:image/svg+xml;base64,${window.btoa(logo)}`;

class App extends Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "App"
    }, /*#__PURE__*/React.createElement("header", {
      className: "App-header"
    }, /*#__PURE__*/React.createElement("img", {
      src: logoData,
      className: "App-logo",
      alt: "logo"
    }), /*#__PURE__*/React.createElement("h1", {
      className: "App-title"
    }, "Welcome to React")), /*#__PURE__*/React.createElement("p", {
      className: "App-intro"
    }, "To get started, edit ", /*#__PURE__*/React.createElement("code", null, "src/App.js"), " and save to reload."));
  }

}

export default App;