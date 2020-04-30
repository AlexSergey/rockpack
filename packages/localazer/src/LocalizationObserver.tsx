import React, { Component, createContext, useContext } from 'react';
import Jed from 'jed';
import { isFunction, isDefined, isObject, isString } from 'valid-types';
import { getDefault, LocaleData } from './utils';
import { I18N } from './jed';

export interface LocalizationObserverContextInterface {
  attachComponent: (component: Component) => void;
  detachComponent: (id: number) => void;
  getI18n: () => I18N;
}

export const LocalizationObserverContext = createContext<LocalizationObserverContextInterface>(null);

export const useI18n = (): I18N => useContext(LocalizationObserverContext).getI18n();

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
  private components = {};

  private uid = 0;

  private readonly i18n: I18N;

  static defaultProps = {
    active: 'en',
    defaultLang: 'en',
    languages: {},
    defaultLocaleData: null
  };

  constructor(props) {
    super(props);
    this.i18n = new Jed({ domain: 'messages' });
    this.changeLocalization(this.props.active);
  }

  componentDidUpdate(prevProps): void {
    if (this.props.active !== prevProps.active) {
      this.changeLocalization(this.props.active);
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

  getI18n = (): I18N => this.i18n;

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

      this.i18n.options = localeData;

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
        detachComponent: this.detachComponent,
        getI18n: this.getI18n
      }}
      >
        {this.props.children ? this.props.children : null}
      </LocalizationObserverContext.Provider>
    );
  }
}
