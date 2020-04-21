import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useQuery } from 'react-apollo';
import { useWillMount } from '../../../src';

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
  const { data, refetch } = useQuery(GET_BOOKS);

  useWillMount(() => refetch());

  return (
    <div>
      {!data && <h3>Loading...</h3>}
      {data && data.books && Array.isArray(data.books) && data.books.map(book => (
        <div key={book.id}>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
};
