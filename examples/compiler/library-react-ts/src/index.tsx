import React, { Component } from 'react';

interface ClockState {
  color: string;
}

export class ColorString extends Component<ClockState> {
  override render(): React.ReactNode {
    return <p style={{ backgroundColor: colorMiddleware(this.props.color) }}>Hello world</p>;
  }
}

export function colorMiddleware(color: string): string {
  return color;
}
