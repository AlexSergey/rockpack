import { Readable } from 'stream';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import MetaTagsServer from 'react-meta-tags/server';
import ignoreFiles from './utils/ignoreFiles';
import makeLoadableExtractor from './utils/makeLoadableExtractor';
import { renderHeader, renderFooter } from './isomorphic/render';
import readHTMLStream from './isomorphic/readHTMLStream';
import isBackend from './utils/isBackend';
import createJSX from './isomorphic/createJSX';

async function useUssr(ctx, options = {}) {
    if (options.liveReloadPort && typeof options.liveReloadPort === 'string') {
        options.liveReloadPort = parseInt(options.liveReloadPort);
    }
    options = Object.assign({
        hasVendor: false,
        isProduction: false,
        liveReloadPort: false
    }, options);

    const stream = new Readable();
    const metaTagsInstance = MetaTagsServer();

    let { jsx, store, css } = createJSX({
        ctx,
        context: {},
        metaTagsInstance,
        webExtractor: options.webExtractor,
        createStore: options.createStore,
        App: options.App,
        isProduction: options.isProduction
    });

    renderToString(jsx);

    const meta = metaTagsInstance.renderToString();

    const sagasInProgress = store.playSagas();

    await Promise.all(sagasInProgress);

    const reduxState = store.getState();

    stream.push(renderHeader(meta));
    ctx.status = 200;
    ctx.res.write(renderHeader(meta));

    jsx = createJSX({
        ctx,
        context: {},
        metaTagsInstance,
        webExtractor: options.webExtractor,
        createStore: options.createStore,
        App: options.App,
        isProduction: options.isProduction
    }).jsx;

    const htmlSteam = renderToNodeStream(jsx);
    htmlSteam.pipe(ctx.res, { end: false });
    await readHTMLStream(htmlSteam);

    let scripts = '';

    if (!!options.hasVendor) {
        scripts += '<script  src="/vendor.js" type="text/javascript"></script>\n';
    }

    scripts += options.webExtractor.getScriptTags();

    ctx.res.write(
        renderFooter({
            reduxState,
            css: options.isProduction ?
                `<link rel="stylesheet" type="text/css" href="/styles.css" />` :
                `<style type="text/css">${[...css].join('')}</style>`,
            scripts,
            liveReloadPort: options.liveReloadPort,
            isProduction: options.isProduction
        })
    );
    ctx.res.end();
}

export {
    useUssr,
    ignoreFiles,
    isBackend,
    makeLoadableExtractor
}
