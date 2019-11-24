import React from 'react';
import { hydrate } from 'react-dom';
import { renderApp } from './App';
import createStore from './store';
import { createBrowserHistory } from 'history';
import { ClientStyles, loadableReady } from '@rock/ussr/client';
const history = createBrowserHistory();
const store = createStore(history);

loadableReady(() => {
    hydrate(
        <ClientStyles>
            {renderApp({
                history: history,
                store
            })}
        </ClientStyles>,
        document.getElementById('root')
    );
});
