import React from 'react';
import style from './assets/reset.css';
import { withStyles } from '@rock/ussr/client';
import Routes from './routes';

const App = props => {
    return <Routes {...props} />
};

export default withStyles(style)(App);
