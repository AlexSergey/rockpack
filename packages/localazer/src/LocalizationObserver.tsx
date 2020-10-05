import { Component } from 'react';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { getDefault, LocaleData } from './utils';
import { i18n } from './jed';

export interface LanguagesInterface {
  [key: string]: LocaleData;
}

interface LocalizationObserverInterface {
  currentLanguage: string;
  defaultLanguage: string;
  languages: LanguagesInterface;
  defaultLocaleData?: LocaleData;
  onChange?: (locale: string) => void;
  children?: JSX.Element;
}

interface Components {
  [key: number]: Component;
}

export const components: Components = {};

let uid = 0;

export const getID = (): number => uid++;

export default class LocalizationObserver extends Component<LocalizationObserverInterface> {
  static defaultProps = {
    currentLanguage: 'en',
    defaultLanguage: 'en',
    languages: {},
    defaultLocaleData: null
  };

  constructor(props) {
    super(props);
    this.changeLocalization(this.props.currentLanguage);
  }

  componentDidUpdate(prevProps): void {
    if (this.props.currentLanguage !== prevProps.currentLanguage) {
      this.changeLocalization(this.props.currentLanguage);
    }
  }

  changeLocalization(locale: string): void {
    locale = this.props.languages[locale] ? locale : this.props.defaultLanguage;
    const localeData = this.props.languages[locale] ? this.props.languages[locale] :
      getDefault(this.props.defaultLanguage, this.props.defaultLocaleData);

    this.updateComponents(localeData, locale);
  }

  updateComponents(localeData, locale): void {
    if (localeData && isObject(localeData.locale_data) && isObject(localeData.locale_data.messages)) {
      if (isFunction(this.props.onChange) && isString(locale)) {
        this.props.onChange(locale);
      }

      i18n.options = localeData;

      Object.keys(components)
        .forEach(id => {
          if (isDefined(components[id])) {
            components[id].forceUpdate();
          }
        });
    }
  }

  render(): JSX.Element {
    return this.props.children;
  }
}
