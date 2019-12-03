import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Menu from "@material-ui/icons/Menu";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import stylesHeader from '../assets/jss/material-dashboard-react/components/headerStyle';
import classNames from 'classnames';
import FlagIcon from '../utils/FlagIcon';
import Avatar from '@material-ui/core/Avatar';

const useStylesHeader = makeStyles(stylesHeader);

const Header = (props) => {
  const classesHeader = useStylesHeader();
  const appBarClasses = classNames({
    [" " + classesHeader[props.color]]: props.color
  });
  let defaultLang = localStorage.getItem('lang') || 'en';
  return (
    <AppBar className={classesHeader.appBar + appBarClasses} style={{height: '75px'}}>
      <Toolbar className={classesHeader.container}>
        {props.logo && <Hidden smDown implementation="css">
          <div style={{padding: '0 20px 0'}}>
            <Avatar alt={typeof props.logoAlt || ''} src={props.logo} />
          </div>
        </Hidden>}
        <div className={classesHeader.flex}>
          {props.title || 'Documentation'}
        </div>
        {typeof props.localization === 'object' ? <div style={{padding: '0 20px 0'}}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={defaultLang}
            onChange={props.changeLocal}
          >
            {Object.keys(props.localization).map(code => {
              return <MenuItem value={'en'} key={code}>
                <FlagIcon code={code} />
              </MenuItem>;
            })}
          </Select>
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
