import React from 'react';
import { hydrate } from 'react-dom';
import renderApp from './renderApp';
import { ClientStyles, loadableReady } from '@rock/ussr/client';

loadableReady(() => {
    hydrate(
        <ClientStyles>
            {renderApp({
                reduxState: window.REDUX_DATA
            })}
        </ClientStyles>,
        document.getElementById('root')
    );
});
