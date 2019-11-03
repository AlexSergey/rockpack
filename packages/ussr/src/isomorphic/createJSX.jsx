import React from 'react';
import { createMemoryHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { Provider as ReduxProvider } from 'react-redux';
import { MetaTagsContext } from 'react-meta-tags';
import { StaticRouter } from 'react-router-dom';

export default function createJSX({
    ctx,
    context,
    metaTagsInstance,
    webExtractor,
    createStore,
    App,
    isProduction
}) {
    const history = createMemoryHistory();
    const store = createStore(history);
    const css = new Set();
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

    const jsx = isProduction ? webExtractor.collectChunks(<ReduxProvider store={store}>
            <MetaTagsContext extract = {metaTagsInstance.extract}>
                <StaticRouter context={context} location={ctx.request.url}>
                    <App />
                </StaticRouter>
            </MetaTagsContext>
        </ReduxProvider>) : webExtractor.collectChunks(<StyleContext.Provider value={{ insertCss }}>
        <ReduxProvider store={store}>
            <MetaTagsContext extract = {metaTagsInstance.extract}>
                <StaticRouter context={context} location={ctx.request.url}>
                    <App />
                </StaticRouter>
            </MetaTagsContext>
        </ReduxProvider>
    </StyleContext.Provider>);

    return { jsx, store, css };
}
