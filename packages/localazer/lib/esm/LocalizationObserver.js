import { Component } from 'react';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { getDefault } from './utils';
import { active, defaultLang, languages } from './constants';
import i18n from './i18n';
export default class LocalizationObserver extends Component {
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
    changeLocalization(locale) {
        locale = this.props.languages[locale] ? locale : this.props.defaultLang;
        const localeData = this.props.languages[locale] ? this.props.languages[locale] :
            getDefault(this.props.defaultLang, this.props.defaultLocaleData);
        this.updateComponents(localeData, locale);
    }
    updateComponents(localeData, locale) {
        if (localeData && isObject(localeData.locale_data) && isObject(localeData.locale_data.messages)) {
            if (isFunction(this.props.onChange) && isString(locale)) {
                this.props.onChange(locale);
            }
            i18n.options = localeData;
            Object.keys(LocalizationObserver.components)
                .forEach(uid => {
                if (isDefined(LocalizationObserver.components[uid])) {
                    LocalizationObserver.components[uid].forceUpdate();
                }
            });
        }
    }
    render() {
        return this.props.children ? this.props.children : null;
    }
}
LocalizationObserver.components = {};
LocalizationObserver.uid = 0;
LocalizationObserver.defaultProps = {
    active,
    defaultLang,
    languages,
    defaultLocaleData: null
};
