import { Readable } from 'stream';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import MetaTagsServer from 'react-meta-tags/server';
import { renderHeader, renderFooter } from './render';
import readHTMLStream from './readHTMLStream';
import createJSX from './createJSX';

//@ts-ignore
async function useUssr(ctx, options = {}) {
    options = Object.assign({}, {
        hasVendor: false,
        isProduction: false,
        liveReloadPort: false
    }, options);
    //@ts-ignore
    if (options.liveReloadPort && typeof options.liveReloadPort === 'string') {
        //@ts-ignore
        options.liveReloadPort = parseInt(options.liveReloadPort);
    }

    //@ts-ignore
    const render = options.render;
    //@ts-ignore
    const isProduction = options.isProduction;
    //@ts-ignore
    const webExtractor = options.webExtractor;
    //@ts-ignore
    const liveReloadPort = options.liveReloadPort;

    const stream = new Readable();
    const metaTagsInstance = MetaTagsServer();

    let { jsx, store, effects, css } = createJSX({
        ctx,
        metaTagsInstance,
        webExtractor,
        reduxState: {},
        render
    });
    if (!store) {
        console.warn('Store is not defined. Please use "installStore" method in your renderApp');
    }
    renderToString(jsx);

    const meta = metaTagsInstance.renderToString();

    if (effects && Array.isArray(effects) && effects.length > 0) {
        let effectsAsPromise = [];

        effects.forEach(effect => {
            if (typeof effect.then === 'function') {
                effectsAsPromise.push(effect);
            } else if (typeof effect === 'function') {
                let res = effect();

                if (res && typeof res.then === 'function') {
                    effectsAsPromise.push(res);
                }
            }
        });
        if (effectsAsPromise.length > 0) {
            await Promise.all(effectsAsPromise)
        }
    }

    const reduxState = store && typeof store.getState === 'function' ? store.getState() : {};
    stream.push(renderHeader(meta));
    ctx.status = 200;
    ctx.res.write(renderHeader({ meta, isProduction }));

    jsx = createJSX({
        ctx,
        metaTagsInstance,
        webExtractor,
        reduxState,
        render
    }).jsx;

    const htmlSteam = renderToNodeStream(jsx);
    htmlSteam.pipe(ctx.res, { end: false });
    await readHTMLStream(htmlSteam);

    let scripts = '';

    //@ts-ignore
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

export default useUssr;
