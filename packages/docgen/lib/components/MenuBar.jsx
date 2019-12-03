import React from "react";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

const MenuBar = props => {
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
          <div className={classes.sidebarWrapper}>
            {props.children}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open={true}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.sidebarWrapper}>
            {props.children}
          </div>
        </Drawer>
      </Hidden>
    </>
  )
};

export default MenuBar;
