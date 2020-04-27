import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { App } from './App';
import { resolvers, typeDefs } from './Apollo';
import createUssr from '../../../src';
import createStore from './store';

const [, Ussr] = createUssr(window.USSR_DATA);

const link = createHttpLink({
  uri: 'http://localhost:3010'
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.APOLLO_DATA),
  typeDefs,
  resolvers
});
const store = createStore({
  initState: window.REDUX_DATA
});

hydrate(
  <Ussr>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </Ussr>,
  document.getElementById('root')
);
