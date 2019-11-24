import React from 'react';
import Routing from './router';
import styles from './assets/reset.css';
import { withStyles, isBackend } from '@rock/ussr/client';
import { ConnectedRouter } from "connected-react-router";
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';

const Router = isBackend() ? StaticRouter : ConnectedRouter;

export const renderApp = ({
    url,
    store,
    history,
    routerContext
}) => {
    const routerParams = isBackend() ? {
        url,
        context: routerContext
    } : {
        history
    };
    return <ReduxProvider store={store}>
        <Router {...routerParams}>
            {withStyles(styles)(Routing)}
        </Router>
    </ReduxProvider>
};
