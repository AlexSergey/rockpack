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
import { getDataFromTree } from '@apollo/react-ssr';
import { App, resolvers, typeDefs } from './App';
import { renderToString } from 'react-dom/server';
import createUssr from '../../../src';

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
  const pureClient = getClient({});
  const [runEffects, UssrRunEffects] = createUssr({});

  await getDataFromTree((
    <UssrRunEffects>
      <ApolloProvider client={pureClient}>
        <App />
      </ApolloProvider>
    </UssrRunEffects>
  ));

  const state = await runEffects();
  const client = getClient(pureClient.extract());

  const [, Ussr] = createUssr(state, {
    ignoreWillMount: true
  });

  const html = renderToString(
    <Ussr>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Ussr>
  );

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
