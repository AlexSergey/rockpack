import { LocaleData } from '@localazer/component';

export interface Localization {
  [key: string]: {
    component: JSX.Element;
    language: LocaleData;
  };
}

export interface DocgenRouteInterface {
  nodeId?: string;
  url?: string;
  title?: string;
  name?: string;
  menuClassName?: string;
  uniqId?: string;
  children?: JSX.Element | DocgenRouteInterface[];
  component?: JSX.Element;
}

export interface ExternalPropsInterface {
  title?: string;
  logo?: string;
  logoAlt?: string;
  github?: string;
  docgen: DocgenRouteInterface | DocgenRouteInterface[];
  footer: JSX.Element;
  localization?: Localization;
  ga?: string;
}

export interface LangWrapperInterface {
  localization?: Localization;
  children: () => JSX.Element;
}

export interface InnerInterface extends ExternalPropsInterface {
  openIds: string[];
  hasRoutes: boolean;
  isLocalized: boolean;
  activeLang: string;
  changeLocal: (lang: string) => void;
  languages: string[] | boolean;
  toggleOpenId: () => void;
  children: (route?: unknown) => JSX.Element;
}

export interface LayoutInterface extends ExternalPropsInterface {
  openIds: string[];
  hasRoutes: boolean;
  isLocalized: boolean;
  activeLang: string;
  changeLocal: (lang: string) => void;
  languages: string[] | boolean;
  toggleOpenId: () => void;
}

export interface HeaderInterface extends ExternalPropsInterface {
  color?: string;
  isLocalized: boolean;
  activeLang: string;
  changeLocal: (lang: string) => void;
  handleDrawerToggle: () => void;
}
