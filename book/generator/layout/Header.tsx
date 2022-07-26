import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import GitHub from '@material-ui/icons/GitHub';
import Menu from '@material-ui/icons/Menu';
import classNames from 'classnames';
import React, { isValidElement } from 'react';

import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import { HeaderInterface } from '../types';

const useStylesHeader = makeStyles(stylesHeader);

const Header = (props: HeaderInterface): JSX.Element => {
  const classesHeader = useStylesHeader();
  const appBarClasses = classNames({
    [`${classesHeader[props.color]}`]: props.color,
  });

  return (
    <AppBar className={`app-header ${classesHeader.appBar + appBarClasses}`} style={{ height: '75px' }}>
      <Toolbar className={`${classesHeader.container} logo-holder`} style={{ height: '100%' }}>
        {props.logo && (
          <Hidden xsDown implementation="css">
            {typeof props.logo === 'string' && (
              <div style={{ height: '100%', margin: '0 20px 0' }} className="logo-holder">
                <img
                  src={props.logo}
                  alt={typeof props.logoAlt || ''}
                  style={{
                    height: '100%',
                    maxWidth: '100px',
                    width: 'auto',
                  }}
                />
              </div>
            )}
          </Hidden>
        )}
        <div className={`app-title ${classesHeader.flex}`}>{props.title || 'Documentation'}</div>
        {props.isLocalized ? (
          <div style={{ padding: '0 20px 0' }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              className="language-select"
              value={props.activeLang}
              onChange={(e): void => {
                if (typeof e.target.value === 'string') {
                  props.changeLocal(e.target.value);
                }
              }}
            >
              {Object.keys(props.localization).map((code) => {
                if (typeof props.localization[code] && isValidElement(props.localization[code].component)) {
                  return (
                    <MenuItem value={code} key={code}>
                      {props.localization[code].component}
                    </MenuItem>
                  );
                }

                return (
                  <MenuItem value={code} key={code}>
                    {code}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        ) : null}
        {props.github ? (
          <div style={{ padding: '0 20px 0 0' }} className="github-holder">
            <a href={props.github} target="_blank" rel="noopener noreferrer">
              <GitHub />
            </a>
          </div>
        ) : null}
        <Hidden mdUp implementation="css">
          <IconButton color="inherit" aria-label="open drawer" onClick={props.handleDrawerToggle}>
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
