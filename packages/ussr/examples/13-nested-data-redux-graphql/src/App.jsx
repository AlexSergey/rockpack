/*import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const books = [
  {
    __typename: 'Book',
    id: '1',
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    read: false
  },
  {
    __typename: 'Book',
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    read: true
  },
];

export const typeDefs = gql`
  type Query {
    books: Book
  }

  type Book {
    id: String
    title: String
  }
`;

const effect = () => new Promise((resolve) => setTimeout(() => resolve(books), 1000));

export const resolvers = {
  Query: {
    books: async () => await effect()
  }
};

const GET_BOOKS = gql`
  query {
    books @client {
      id
      title
      read
    }
  }
`;

export const App = () => {
  const { data } = useQuery(GET_BOOKS);

  const loaded = data && data.books && Array.isArray(data.books);

  return (
    <div>
      {!data && <h3>Loading...</h3>}
      {loaded && data.books.map(book => (
        <div key={book.id}>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
};
*/

import React from 'react';
import { useUssrState, useWillMount } from '../../../src';
import { Apollo } from './Apollo';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world', apollo: true }), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ', apollo: false });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
      {state.apollo && <Apollo />}
    </div>
  );
};
