import { LocaleData } from '@rock/localazer';

interface Localization {
  [key: string]: {
    component: JSX.Element;
    language: LocaleData;
  };
}

interface DocgenRouteInterface {
  nodeId?: string;
  url?: string;
  title?: string;
  name?: string;
  uniqId?: string;
  children: JSX.Element | DocgenRouteInterface[];
  component: JSX.Element;
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

interface OpenIdsInterface {

}