import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isString } from 'valid-types';
import LocalizationObserver from './LocalizationObserver';

class Localization extends Component {
    constructor(props) {
        super(props);
        this.id = ++LocalizationObserver.uid;
        LocalizationObserver.components[this.id] = this;
    }

    componentWillUnmount() {
        delete LocalizationObserver.components[this.id];
    }

    render() {
        return isFunction(this.props.children) ? (
            <span
                className={`localization-node ${isString(this.props.className) ? this.props.className : ''}`}
                dangerouslySetInnerHTML={{ __html: this.props.children() }}
            />
        ) : null;
    }
}
Localization.propTypes = {
    className: PropTypes.string,
    children: PropTypes.func.isRequired,
};

export default Localization;
