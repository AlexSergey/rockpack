import React, { Component } from 'react';
import renderText from './renderText';
import css from './styles/index.modules.css';
export function colorMiddleware(color) {
    return color;
}
export default class ColorString extends Component {
    render() {
        return React.createElement("p", { style: { backgroundColor: colorMiddleware(this.props.color) }, className: css.block }, renderText());
    }
}
