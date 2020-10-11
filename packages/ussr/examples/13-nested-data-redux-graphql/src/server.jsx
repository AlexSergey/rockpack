import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { ApolloProvider, getApolloContext } from '@apollo/react-common';
import { RenderPromises } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { App } from './App';
import { resolvers, typeDefs } from './Apollo';
import { serverRender } from '../../../src';
import createStore from './store';

const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, '../public')));

router.get('/*', async (ctx) => {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: 'http://localhost:3010',
      fetch
    }),
    typeDefs,
    resolvers
  });
  const store = createStore({
    initState: {}
  });
  const ApolloContext = getApolloContext();
  const renderPromises = new RenderPromises();

  const { html, state } = await serverRender(() => (
    <ApolloContext.Provider value={{ ...{}, renderPromises }}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </ApolloContext.Provider>
  ), (effects) => {
    console.log(renderPromises.hasPromises());
    if (renderPromises.hasPromises()) {
      return effects.concat(renderPromises.consumeAndAwaitPromises());
    }
  });

  const apolloState = client.extract();
  const reduxState = store && typeof store.getState === 'function' ? store.getState() : {};

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
      window.APOLLO_DATA = ${serialize(apolloState, { isJSON: true })}
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
      window.REDUX_DATA = ${serialize(reduxState, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
</body>
</html>
`;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(4000, () => {
  console.log(`Server is listening ${4000} port`);
});
