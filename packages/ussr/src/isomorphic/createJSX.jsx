import React from 'react';
import { createMemoryHistory } from 'history';
//@ts-ignore
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { MetaTagsContext } from 'react-meta-tags';

export default function createJSX({
    ctx,
    context,
    metaTagsInstance,
    webExtractor,
    createStore,
    render
}) {
    const history = createMemoryHistory();
    const store = createStore(history);
    const css = new Set();
    //@ts-ignore
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

    const jsx = webExtractor.collectChunks(<StyleContext.Provider value={{ insertCss }}>
        <MetaTagsContext extract = {metaTagsInstance.extract}>
            {render({
                url: ctx.request.url,
                routerContext: context,
                metaTagsExtract: metaTagsInstance.extract,
                history,
                store
            })}
        </MetaTagsContext>
    </StyleContext.Provider>);

    return { jsx, store, css };
}
