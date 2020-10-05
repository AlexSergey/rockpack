import React, { Component } from 'react';
import { isFunction, isString } from 'valid-types';
import { getID, components } from './LocalizationObserver';

interface LocalizationInterface {
  className?: string;
  children: () => string;
}

class Localization extends Component<LocalizationInterface> {
  private id: number;

  componentDidMount(): void {
    this.id = getID();
    components[this.id] = this;
  }

  componentWillUnmount(): void {
    delete components[this.id];
  }

  render(): JSX.Element {
    return isFunction(this.props.children) ? (
      <span
        className={`localization-node ${isString(this.props.className) ? this.props.className : ''}`}
        dangerouslySetInnerHTML={{ __html: this.props.children() }}
      />
    ) : null;
  }
}

export default Localization;
