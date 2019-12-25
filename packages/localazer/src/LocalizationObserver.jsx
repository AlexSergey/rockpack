import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDefault } from './utils';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { active, defaultLang, languages } from './constants';
import jed from './i18n';

class LocalizationObserver extends Component {
    static components = {};
    static uid = 0;

    changeLocalization(locale) {
        locale = this.props.languages[locale] ? locale : this.props.defaultLang;
        let localeData = this.props.languages[locale] ? this.props.languages[locale] : getDefault(this.props.defaultLang, this.props.defaultLocaleData);

        this.updateComponents(localeData, this.props.languages, locale);
    }

    updateComponents(localeData, locale) {
        if (localeData && isObject(localeData.locale_data) && isObject(localeData.locale_data.messages)) {
            if (isFunction(this.props.onChange) && isString(locale)) {
                this.props.onChange(locale);
            }

            jed.getJed().options = localeData;

            Object.keys(LocalizationObserver.components).forEach(uid => {
                if (isDefined(LocalizationObserver.components[uid])) {
                    LocalizationObserver.components[uid].forceUpdate();
                }
            });
        }
    }

    componentDidMount() {
        if (this.props.active !== this.props.defaultLang) {
            this.changeLocalization(this.props.active);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.active !== prevProps.active) {
            this.changeLocalization(this.props.active);
        }
    }

    render() {
        return this.props.children ? this.props.children : null;
    }
}

LocalizationObserver.defaultProps = {
    active: active,
    defaultLang: defaultLang,
    languages: languages,
    defaultLocaleData: null
};

LocalizationObserver.propTypes = {
    active: PropTypes.string,
    defaultLang: PropTypes.string,
    languages: PropTypes.object,
    onChange: PropTypes.func
};

export default LocalizationObserver;
