import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../assets/jss/material-dashboard-react/components/sidebarStyle';

const useStyles = makeStyles(styles);

interface MenuBarInterface {
  open: boolean;
  children: (state: boolean) => JSX.Element;
  handleDrawerToggle: () => void;
}

const MenuBar = (props: MenuBarInterface): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      <Hidden mdUp implementation="css">
        <Drawer
          anchor="right"
          variant="temporary"
          open={props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
        >
          <div className={`app-sidebar ${classes.sidebarWrapper}`}>
            {props.children(true)}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={`app-sidebar ${classes.sidebarWrapper}`}>
            {props.children(false)}
          </div>
        </Drawer>
      </Hidden>
    </>
  );
};

export default MenuBar;
