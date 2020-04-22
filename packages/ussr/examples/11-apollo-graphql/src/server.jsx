import path from 'path';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import serialize from 'serialize-javascript';
import { ApolloProvider } from '@apollo/react-common';
import { ApolloClient } from 'apollo-client';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { App, resolvers, typeDefs } from './App';
import { serverRender } from '../../../src';

const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, '../public')));

const getClient = (state) => (
  new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache().restore(state),
    link: createHttpLink({
      uri: 'http://localhost:3010',
      fetch
    }),
    typeDefs,
    resolvers
  })
);

router.get('/*', async (ctx) => {
  const client = getClient({});

  const { html } = await serverRender({
    render: () => {
      const apolloState = client.extract();
      const apolloStateIsEmpty = Object.keys(apolloState).length === 0;

      return (
        /*If apollo state is empty will use simple client*/
        /*If apollo state is NOT empty will be created another client with state*/
        <ApolloProvider client={apolloStateIsEmpty ? client : getClient(apolloState)}>
          <App apolloStateIsEmpty={apolloStateIsEmpty} />
        </ApolloProvider>
      );
    }
  });

  const apolloState = client.extract();

  ctx.body = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
      window.APOLLO_DATA = ${serialize(apolloState, { isJSON: true })}
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
