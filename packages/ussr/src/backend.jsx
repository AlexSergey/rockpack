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
    let jsx, store, css, appCurrent;
    const stream = new Readable();
    const metaTagsInstance = MetaTagsServer();
    const context = {};

    appCurrent = createJSX({
        ctx,
        context,
        metaTagsInstance,
        webExtractor: options.webExtractor,
        createStore: options.createStore,
        App: options.App
    });

    jsx = appCurrent.jsx;
    store = appCurrent.store;
    css = appCurrent.css;
    renderToString(jsx);

    const meta = metaTagsInstance.renderToString();

    const sagasInProgress = store.waitSagas();

    await Promise.all(sagasInProgress);

    const reduxState = store.getState();

    stream.push(renderHeader(meta));
    ctx.status = 200;
    ctx.res.write(renderHeader(meta));
    appCurrent = createJSX({
        ctx,
        context,
        metaTagsInstance,
        webExtractor: options.webExtractor,
        createStore: options.createStore,
        App: options.App
    });
    jsx = appCurrent.jsx;

    const htmlSteam = renderToNodeStream(jsx);
    htmlSteam.pipe(ctx.res, { end: false });
    await readHTMLStream(htmlSteam);

    let scripts = '';

    if (!!process.env.FRONTEND_HAS_VENDOR) {
        scripts += '<script  src="/vendor.js" type="text/javascript"></script>\n';
    }

    scripts += options.webExtractor.getScriptTags();

    ctx.res.write(
        renderFooter(
            reduxState,
            process.env.NODE_ENV === 'development' ?
                `<style type="text/css">${[...css].join('')}</style>` :
                `<link rel="stylesheet" type="text/css" href="/styles.css" />`,
            scripts
        )
    );
    ctx.res.end();
}

export {
    useUssr,
    ignoreFiles,
    isBackend,
    makeLoadableExtractor
}
