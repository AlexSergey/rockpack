import React from 'react';
import { hydrate, render } from 'react-dom';
import axios from 'axios';
import { ClientStyles, loadableReady } from '@rock/ussr/client';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import App from './App';
import createStore from './store';
import watchFetchDog from './containers/Dog/saga';

const renderer = process.env.FRONT_ONLY ? render : hydrate;
const loadable = process.env.FRONT_ONLY ? (fn) => fn() : loadableReady;

loadable(() => {
    const instance = axios.create({
        url: 'http://localhost:6000',
        timeout: 1000
    });

    const store = createStore({
        reduxState: window.REDUX_DATA
    });

    store.runSaga(watchFetchDog, instance).toPromise();

    return renderer(
        <ClientStyles>
            <Provider store={store}>
                <Router history={createBrowserHistory()}>
                    <App />
                </Router>
            </Provider>
        </ClientStyles>,
        document.getElementById('root')
    );
});
