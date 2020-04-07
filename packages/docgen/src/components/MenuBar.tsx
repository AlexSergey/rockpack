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

const MenuBar = (props: MenuBarInterface) => {
  const classes = useStyles();
  
  return (
    <>
      <Hidden mdUp implementation="css">
        <Drawer
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
          <div
            className={classes.sidebarWrapper}
            style={{
              background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
              color: '#fff',
              padding: '20px'
            }}
          >
            {props.children(true)}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div
            className={classes.sidebarWrapper}
            style={{
              background: 'linear-gradient(180deg, #5c6bc0 0%, #3949ab 100%)',
              color: '#fff',
              padding: '20px'
            }}
          >
            {props.children(false)}
          </div>
        </Drawer>
      </Hidden>
    </>
  );
};

export default MenuBar;
