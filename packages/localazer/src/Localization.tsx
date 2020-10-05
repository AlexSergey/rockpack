import React, { Component } from 'react';
import { isFunction, isString } from 'valid-types';
import { LocalizationObserverContext } from './LocalizationObserver';

interface LocalizationInterface {
  className?: string;
  children: () => string;
}

class Localization extends Component<LocalizationInterface> {
  static contextType = LocalizationObserverContext;

  private id: number;

  componentDidMount(): void {
    this.id = this.context.attachComponent(this);
  }

  componentWillUnmount(): void {
    this.context.detachComponent(this.id);
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
