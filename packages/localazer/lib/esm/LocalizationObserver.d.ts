import { Component } from 'react';
import { LocaleData } from './utils';
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
    static components: {};
    static uid: number;
    static defaultProps: {
        active: string;
        defaultLang: string;
        languages: {};
        defaultLocaleData: any;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    changeLocalization(locale: string): void;
    updateComponents(localeData: any, locale: any): void;
    render(): JSX.Element;
}
export {};
