import React, { Component } from 'react';

type ClockState = {
    color: string
}

export function colorMiddleware(color: string): string {
    return color;
}

export default class ColorString extends Component<ClockState> {
    render() {
        return <p style={{backgroundColor: colorMiddleware(this.props.color)}}>Hello world</p>
    }
}
