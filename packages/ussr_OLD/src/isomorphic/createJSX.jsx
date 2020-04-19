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
    let store, effects = [];

    const setStore = s => {
        store = s;
    };

    const setEffect = (...args) => {
        effects = effects.concat(args);
    };

    const jsx = webExtractor.collectChunks(
        <StyleContext.Provider value={{ insertCss }}>
            <MetaTagsContext extract={metaTagsInstance.extract}>
                {render({
                    request: ctx.request,
                    reduxState,
                    setStore,
                    setEffect
                })}
            </MetaTagsContext>
        </StyleContext.Provider>
    );

    return { jsx, store, css, effects };
}