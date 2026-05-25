import React, { Component } from 'react';

import { renderText } from './render-text';
import css from './styles/index.module.css';
import { check } from './utils/nested/check';

interface ClockState {
  color: string;
}

export class ColorString extends Component<ClockState> {
  override render(): React.ReactNode {
    return (
      <p className={css.block} style={{ backgroundColor: colorMiddleware(this.props.color) }}>
        {renderText()}
      </p>
    );
  }
}

export function colorMiddleware(color: string): string {
  return check(color) ? color : '#f00';
}
