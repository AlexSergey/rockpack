import React, { useEffect, useState } from 'react';
import scrollToElement from 'scroll-to-element';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import MenuItems from '../components/MenuItems';
import MenuBar from '../components/MenuBar';
import Route from '../components/Route';
import Page from '../components/Page';
import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';

const useStyles = makeStyles(styles);

const Layout = (props) => {
  const { hasRoutes } = props;
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
    }, 300);
  }, []);
  
  return (
    <div className={`${classes.wrapper} ${!hasRoutes && ' without-routes'}`}>
      {hasRoutes ? <MenuBar handleDrawerToggle={handleDrawerToggle} open={mobileOpen}>
        {isMobile => <MenuItems {...props} handleDrawerToggle={() => isMobile && handleDrawerToggle()} />}
      </MenuBar> : null}
      <div className={classes.mainPanel} style={{ overflow: 'hidden', maxHeight: 'none' }}>
        <Header {...props} handleDrawerToggle={handleDrawerToggle} />
        <Content>
          {hasRoutes ? <Route {...props}>
            {routes => {
              return Page(routes, props);
            }}
          </Route> : Page(props.docgen, props)}
        </Content>
        <Footer {...props} />
      </div>
    </div>
  )
};

export default Layout;
