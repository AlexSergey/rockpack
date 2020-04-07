import * as React from 'react';
import ReactDOM from 'react-dom';
import ColorComponent from './Color.Component';
ReactDOM.render(React.createElement("div", null,
    React.createElement(ColorComponent, { color: "red" })), document.getElementById('root'));
