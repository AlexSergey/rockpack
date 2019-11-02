import React from 'react';
import { readFileSync } from 'fs';
import App from './App';
import { useUssr, makeLoadableExtractor, ignoreFiles } from '@rock/ussr';
import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import Router from 'koa-router';
import path from 'path';
import createStore from './store';

const app = new Koa();

app.use(logger());
app.use(serve(path.resolve( __dirname, '../public' )));
app.use(ignoreFiles(['ico']));

const router = new Router();

const currentFolder = path.basename(process.cwd());

const stats = JSON.parse(
    readFileSync(currentFolder === 'dist' ?
        path.resolve('./stats.json') :
        path.resolve('./dist/stats.json'),
        'utf8')
);

const webExtractor = makeLoadableExtractor({
    stats
});

router.get('/*', async ctx => {
    console.log(ctx.request.url);
    return await useUssr(ctx, {
        webExtractor,
        createStore,
        App
    })
});

app
    .use(router.routes())
    .use(router.allowedMethods());

const server = app.listen(5000, () => {
    /*if (process.env.NODE_ENV === 'development') {
        console.log(`LiveReload connected to ${process.env.__LIVE_RELOAD__} port`);
    }
    console.log(`http://localhost:${process.env.ISOMORPHIC_SERVER_PORT}/`);
    console.log(`Server connected to ${process.env.ISOMORPHIC_SERVER_PORT} port`);*/
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

/*if (process.env.NODE_ENV === 'development') {
    sourceMapSupport.install();
}*/
