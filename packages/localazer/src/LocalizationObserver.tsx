import { Component } from 'react';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { getDefault, LocaleData } from './utils';
import { active, defaultLang, languages } from './constants';
import i18n from './i18n';

export interface LanguagesInterface {
  [key: string]: LocaleData;
}

interface LocalizationObserverInterface {
  active: string;
  defaultLang: string;
  languages: LanguagesInterface;
  defaultLocaleData?: LocaleData;
  onChange?: (locale: string) => void;
  children?: JSX.Element;
}

export default class LocalizationObserver extends Component<LocalizationObserverInterface> {
  static components = {};
  
  static uid = 0;
  
  static defaultProps = {
    active,
    defaultLang,
    languages,
    defaultLocaleData: null
  };
  
  componentDidMount(): void {
    if (this.props.active !== this.props.defaultLang) {
      this.changeLocalization(this.props.active);
    }
  }
  
  componentDidUpdate(prevProps): void {
    if (this.props.active !== prevProps.active) {
      this.changeLocalization(this.props.active);
    }
  }
  
  changeLocalization(locale: string): void {
    locale = this.props.languages[locale] ? locale : this.props.defaultLang;
    const localeData = this.props.languages[locale] ? this.props.languages[locale] :
      getDefault(this.props.defaultLang, this.props.defaultLocaleData);
    
    this.updateComponents(localeData, locale);
  }
  
  updateComponents(localeData, locale): void {
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
  
  render(): JSX.Element {
    return this.props.children ? this.props.children : null;
  }
}
