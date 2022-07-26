import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import scrollToElement from 'scroll-to-element';

import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';
import MenuBar from '../components/MenuBar';
import MenuItems from '../components/MenuItems';
import Page from '../components/Page';
import Route from '../components/Route';
import { LayoutInterface } from '../types';

import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const useStyles = makeStyles(styles);

const Layout = (props: LayoutInterface): JSX.Element => {
  const { hasRoutes, noSidebar } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      if (document.location.hash.indexOf('#') === 0) {
        scrollToElement(document.location.hash);
      }
    }, 300);
  }, []);

  return (
    <div className={`${classes.wrapper} ${!hasRoutes ? ' without-routes' : ''} ${noSidebar && ' without-sidebar'}`}>
      {hasRoutes
        ? !noSidebar && (
            <MenuBar handleDrawerToggle={handleDrawerToggle} open={mobileOpen}>
              {(isMobile): JSX.Element => (
                <MenuItems {...props} handleDrawerToggle={(): void => isMobile && handleDrawerToggle()} />
              )}
            </MenuBar>
          )
        : null}
      <div className={`${classes.mainPanel} site-section`} style={{ maxHeight: 'none', overflow: 'hidden' }}>
        <Header {...props} handleDrawerToggle={handleDrawerToggle} />
        <Content>
          {hasRoutes ? (
            <Route {...props}>{(routes): JSX.Element => Page(routes, props)}</Route>
          ) : (
            Page(props.docgen, props)
          )}
        </Content>
        <Footer {...props} />
      </div>
    </div>
  );
};

export default Layout;
