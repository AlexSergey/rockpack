import React from 'react';
//@ts-ignore
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { MetaTagsContext } from 'react-meta-tags';

export default function createJSX({
    ctx,
    metaTagsInstance,
    webExtractor,
    reduxState,
    render
}) {
    const css = new Set();
    //@ts-ignore
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));
    let store;
    const ussrStore = s => {
        store = s;
    };
    const jsx = webExtractor.collectChunks(<StyleContext.Provider value={{ insertCss }}>
        <MetaTagsContext extract={metaTagsInstance.extract}>
            {render({
                url: ctx.request.url,
                ussrStore,
                reduxState
            })}
        </MetaTagsContext>
    </StyleContext.Provider>);

    return { jsx, store, css };
}
