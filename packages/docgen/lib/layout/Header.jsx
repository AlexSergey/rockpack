import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Menu from "@material-ui/icons/Menu";
import GitHub from '@material-ui/icons/GitHub';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import classNames from 'classnames';
import FlagIcon from '../utils/FlagIcon';

const useStylesHeader = makeStyles(stylesHeader);

const Header = (props) => {
  const classesHeader = useStylesHeader();
  const appBarClasses = classNames({
    [" " + classesHeader[props.color]]: props.color
  });
  return (
    <AppBar className={classesHeader.appBar + appBarClasses} style={{height: '75px'}}>
      <Toolbar className={classesHeader.container} style={{height: '100%'}}>
        {props.logo && <Hidden smDown implementation="css" className="wrapper-logo">
          <div style={{height: '100%', padding: '0 20px 0'}}>
              {typeof props.logo === 'string' && <img src={props.logo} alt={typeof props.logoAlt || ''} style={{height: '100%', width: 'auto', maxWidth: '100px'}}/>}
          </div>
        </Hidden>}
        <div className={classesHeader.flex}>
          {props.title || 'Documentation'}
        </div>
        {props.isLocalized ? <div style={{padding: '0 20px 0'}}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.activeLang}
            onChange={(e) => props.changeLocal(e.target.value)}
          >
            {Object.keys(props.localization).map(code => {
              return <MenuItem value={code} key={code}>
                <FlagIcon code={code} />
              </MenuItem>;
            })}
          </Select>
        </div> : null}
          {props.github ? <div style={{padding: '0 20px 0 0'}}>
              <a href={props.github} target="_blank">
                  <GitHub />
              </a>
          </div> : null}
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
};

export default Header;
