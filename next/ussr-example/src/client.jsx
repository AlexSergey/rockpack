import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import { ConnectedRouter } from 'connected-react-router';
import createStore from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ClientStyles, loadableReady } from '@rock/ussr/client';

const history = createBrowserHistory();
const store = createStore(history);

const Client = () => <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
        <App />
    </ConnectedRouter>
</ReduxProvider>;

loadableReady(() => {
    hydrate(<ClientStyles>
        <Client />
    </ClientStyles>,
    document.getElementById('root')
    );
});
