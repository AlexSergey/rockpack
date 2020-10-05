import React, { Component, createContext } from 'react';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { getDefault, LocaleData } from './utils';
import { i18n } from './jed';

export interface LocalizationObserverContextInterface {
  attachComponent: (component: Component) => void;
  detachComponent: (id: number) => void;
}

export const LocalizationObserverContext = createContext<LocalizationObserverContextInterface>(null);

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

export default class LocalizationObserver extends Component<LocalizationObserverInterface> {
  private components = {};

  private uid = 0;

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

  attachComponent = (component: Component): number => {
    const id = this.getID();
    this.components[id] = component;
    return id;
  };

  detachComponent = (id: number): void => {
    delete this.components[id];
  };

  getID = (): number => this.uid++;

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

      Object.keys(this.components)
        .forEach(uid => {
          if (isDefined(this.components[uid])) {
            this.components[uid].forceUpdate();
          }
        });
    }
  }

  render(): JSX.Element {
    return (
      <LocalizationObserverContext.Provider value={{
        attachComponent: this.attachComponent,
        detachComponent: this.detachComponent
      }}
      >
        {this.props.children ? this.props.children : null}
      </LocalizationObserverContext.Provider>
    );
  }
}
