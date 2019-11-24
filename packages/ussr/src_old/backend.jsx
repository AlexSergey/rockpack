import { Readable } from 'stream';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import MetaTagsServer from 'react-meta-tags/server';
import { renderHeader, renderFooter } from './isomorphic/render';
import readHTMLStream from './isomorphic/readHTMLStream';
import isBackend from './utils/isBackend';
import createJSX from './isomorphic/createJSX';

async function useUssr(ctx, options = {}) {
    options = Object.assign({}, {
        hasVendor: false,
        isProduction: false,
        liveReloadPort: false
    }, options);
    if (options.liveReloadPort && typeof options.liveReloadPort === 'string') {
        options.liveReloadPort = parseInt(options.liveReloadPort);
    }

    const App = options.App;
    const isProduction = options.isProduction;
    const webExtractor = options.webExtractor;
    const createStore = options.createStore;
    const liveReloadPort = options.liveReloadPort;

    const stream = new Readable();
    const metaTagsInstance = MetaTagsServer();

    let { jsx, store, css } = createJSX({
        ctx,
        context: {},
        metaTagsInstance,
        webExtractor,
        createStore,
        App
    });

    renderToString(jsx);

    const meta = metaTagsInstance.renderToString();

    const sagasInProgress = store.playSagas();

    await Promise.all(sagasInProgress);

    const reduxState = store.getState();

    stream.push(renderHeader(meta));
    ctx.status = 200;
    ctx.res.write(renderHeader({ meta, isProduction }));

    jsx = createJSX({
        ctx,
        context: {},
        metaTagsInstance,
        webExtractor,
        createStore,
        App
    }).jsx;

    const htmlSteam = renderToNodeStream(jsx);
    htmlSteam.pipe(ctx.res, { end: false });
    await readHTMLStream(htmlSteam);

    let scripts = '';

    if (!!options.hasVendor) {
        scripts += '<script  src="/vendor.js" type="text/javascript"></script>\n';
    }

    scripts += webExtractor.getScriptTags();

    ctx.res.write(
        renderFooter({
            reduxState,
            css: isProduction ?
                `<link rel="stylesheet" type="text/css" href="/styles.css" />` :
                `<style type="text/css">${[...css].join('')}</style>`,
            scripts,
            liveReloadPort,
            isProduction
        })
    );

    ctx.res.end();
}

export {
    useUssr,
    isBackend
}
