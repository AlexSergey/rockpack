import React from 'react';
import { readFileSync } from 'fs';
import App from './App';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import path from 'path';
import sourceMapSupport from 'source-map-support';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './store';
import axios from 'axios';
import { createMiddleware } from '@rock/ussr';

const port = 5000;
const currentFolder = path.basename(process.cwd());
const app = new Koa();
const router = new Router();

app.use(logger());
app.use(serve(path.resolve( __dirname, '../public' )));
app.use(favicon());

const stats = JSON.parse(
    readFileSync(currentFolder === 'dist' ?
        path.resolve('./stats.json') :
        path.resolve('./dist/stats.json'),
        'utf8')
);

const ussr = createMiddleware({
    stats
});

router.get('/*', ussr({
    isProduction: process.env.NODE_ENV === 'production',
    liveReloadPort: process.env.NODE_ENV !== 'production' ? process.env.__LIVE_RELOAD__ : false,
    render: ({
        request,
        reduxState
    }, installStore) => {
        const routerParams = {
            url: request.url,
            context: {}
        };
        const instance = axios.create({
            url: 'http://localhost:6000',
            timeout: 1000
        });

        instance.interceptors.request.use(
            request => {
                request.headers = Object.assign({}, request.headers);
                return request;
            }
        );

        let store = createStore({
            reduxState,
            rest: instance
        });

        installStore(store);

        return (
            <Provider store={store}>
                <StaticRouter {...routerParams}>
                    <App />
                </StaticRouter>
            </Provider>
        );
    }
}));

app
    .use(router.routes())
    .use(router.allowedMethods());

const server = app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`LiveReload connected to ${process.env.__LIVE_RELOAD__} port`);
    }
    console.log(`Server is listening ${port} port`);
});

function handleError(err, ctx) {
    if (ctx == null) {
        console.error('Unhandled exception occurred');
    }
}

async function terminate(signal) {
    server.close();
    process.exit(signal);
}

server.on('error', handleError);

['unhandledRejection', 'uncaughtException'].map(error => {
    process.on(error, handleError);
});

['SIGTERM', 'SIGINT', 'SIGUSR2'].map(signal => {
    process.once(signal, () => terminate(signal));
});

if (process.env.NODE_ENV !== 'production') {
    sourceMapSupport.install({
        environment: 'node'
    });
}
