import useUssr from './isomorphic/useUssr';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import ignoreFiles from './utils/ignoreFiles';
import loadableExtractor from './utils/loadableExtractor';

const createUssr = ({
    stats,
    publicFolder,
    createStore,
    render,
    isProduction,
    liveReloadPort
}) => {
    const app = new Koa();
    const router = new Router();

    app.use(serve(publicFolder));
    app.use(ignoreFiles(['ico']));

    const webExtractor = loadableExtractor({
        stats
    });

    router.get('/*', async ctx => {
        return await useUssr(ctx, {
            webExtractor,
            createStore,
            render,
            isProduction,
            liveReloadPort
        })
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());

    return app;
};

export default createUssr;
