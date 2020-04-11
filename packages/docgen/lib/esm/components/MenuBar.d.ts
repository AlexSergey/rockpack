interface MenuBarInterface {
    open: boolean;
    children: (state: boolean) => JSX.Element;
    handleDrawerToggle: () => void;
}
declare const MenuBar: (props: MenuBarInterface) => JSX.Element;
export default MenuBar;
