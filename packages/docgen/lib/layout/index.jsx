import React, { useEffect, useState } from 'react';
import scrollToElement from 'scroll-to-element';
import { makeStyles } from "@material-ui/core/styles";
import Header from './Header';
import Content from './Content';
import MenuItems from '../components/MenuItems';
import MenuBar from '../components/MenuBar';
import Route from '../components/Route';
import Page from '../components/Page';

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";

const useStyles = makeStyles(styles);

const Layout = (props) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      if (document.location.hash.indexOf('#') === 0) {
        scrollToElement(document.location.hash);
      }
    });
  }, []);
  return (
    <div className={classes.wrapper}>
      <MenuBar handleDrawerToggle={handleDrawerToggle} open={mobileOpen}>
        <MenuItems {...props} handleDrawerToggle={handleDrawerToggle} />
      </MenuBar>
      <div className={classes.mainPanel}>
        <Header {...props} color="black" handleDrawerToggle={handleDrawerToggle} />
        <Content>
          <Route {...props}>
            {(content, sections) => Page(content, sections)}
          </Route>
        </Content>
      </div>
    </div>
  )
};

export default Layout;
