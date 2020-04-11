/// <reference types="react-addons-linked-state-mixin" />
import { RouteComponentProps } from 'react-router-dom';
import { Localization, DocgenRouteInterface } from '../types';
interface MenuItemsInterface extends RouteComponentProps {
    toggleOpenId: (openIds: string[]) => void;
    openIds: string[];
    activeLang?: string;
    docgen: DocgenRouteInterface | DocgenRouteInterface[];
    localization?: Localization;
    handleDrawerToggle?: () => void;
    children?: (isLocalized?: boolean, languageState?: string, handler?: (lang: string) => void) => JSX.Element;
}
declare const MenuItems: import("react").ComponentClass<Pick<MenuItemsInterface, "children" | "toggleOpenId" | "openIds" | "activeLang" | "docgen" | "localization" | "handleDrawerToggle">, any> & import("react-router").WithRouterStatics<(props: MenuItemsInterface) => JSX.Element>;
export default MenuItems;
