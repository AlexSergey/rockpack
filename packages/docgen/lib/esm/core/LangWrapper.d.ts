/// <reference types="react-addons-linked-state-mixin" />
import { RouteComponentProps } from 'react-router-dom';
import { Localization } from '../types';
interface LangWrapperInterface extends RouteComponentProps {
    activeLang?: string;
    localization?: Localization;
    children: (isLocalized?: boolean, languageState?: string, handler?: (lang: string) => void) => JSX.Element;
}
export declare const LangWrapper: import("react").ComponentClass<Pick<LangWrapperInterface, "children" | "activeLang" | "localization">, any> & import("react-router").WithRouterStatics<(props: LangWrapperInterface) => JSX.Element>;
export {};
