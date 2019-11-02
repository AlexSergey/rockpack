import React, { Component } from 'react';
import renderText from './renderText';
import css from './styles/index.modules.css';

type ClockState = {
    color: string
}

export function colorMiddleware(color: string): string {
    return color;
}

export default class ColorString extends Component<ClockState> {
    render() {
        return <p style={{backgroundColor: colorMiddleware(this.props.color)}} className={css.block}>{renderText()}</p>
    }
}
