import React from 'react';
import style from './assets/reset.css';
import { withStyles, isBackend } from '@rock/ussr/client';
import { Router } from "react-router-dom";
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';
import createStore from './store';
import Routes from './routes';

const _Router = isBackend() ? StaticRouter : Router;
const _history = isBackend() ? createMemoryHistory() : createBrowserHistory();

const App = withStyles(style)(props => {
    return <Routes {...props} />
});

const renderApp = ({
    url,
    ussrStore,
    reduxState
} = {}) => {
    const routerParams = isBackend() ? {
        url,
        context: {}
    } : {
        history: _history
    };

    const store = createStore({
        history: _history,
        reduxState
    });

    if (typeof ussrStore === 'function') {
        ussrStore(store);
    }

    return (
        <ReduxProvider store={store}>
            <_Router {...routerParams}>
                <App />
            </_Router>
        </ReduxProvider>
    )
};

export default renderApp;
