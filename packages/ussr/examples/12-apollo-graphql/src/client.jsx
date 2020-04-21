import React from 'react';
import { hydrate } from 'react-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { App, resolvers, typeDefs } from './App';
import createUssr from '../../../src';

/*window.APOLLO_DATA = {
  'Book:1': {
    id: '1',
    title: 'Harry Potter and the Chamber of Secrets',
    read: false,
    __typename: 'Book'
  },
  'Book:2': { id: '2', title: 'Jurassic Park', read: true, __typename: 'Book' },
  ROOT_QUERY: {
    books: [{ type: 'id', generated: false, id: 'Book:1', typename: 'Book' }, {
      type: 'id',
      generated: false,
      id: 'Book:2',
      typename: 'Book'
    }]
  }
};*/
const [, Ussr] = createUssr(window.APOLLO_DATA, { onlyClient: true });

const link = createHttpLink({
  uri: 'http://localhost:3010'
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.APOLLO_DATA),
  typeDefs,
  resolvers
});

hydrate(
  <Ussr>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Ussr>,
  document.getElementById('root')
);
