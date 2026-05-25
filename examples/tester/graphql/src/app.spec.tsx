import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { App } from './app';
import { Graphql, MockGraphql } from './graphql';
import { BOOK_READ, GET_BOOK, GET_BOOKS } from './query.gql';

const renderApp = () =>
  render(
    <Graphql options={{ baseURL: 'http://localhost:4000/graphql/' }}>
      <MockGraphql
        mocks={[
          { data: [{ author: 'S. King', id: '1', read: false, title: 'It' }], query: GET_BOOKS },
          { data: () => [{ author: 'S. King', id: '1', read: true, title: 'It' }], query: BOOK_READ },
          { data: { author: 'Michael Crichton', id: '2', read: false, title: 'Jurassic Park' }, query: GET_BOOK },
        ]}
      >
        <App />
      </MockGraphql>
    </Graphql>,
  );

describe('Test queries', () => {
  test('GET_BOOKS - get the array of books with the book It', async () => {
    renderApp();
    expect(await screen.findByText('It')).toBeInTheDocument();
  });

  test('BOOK_READ - set the book It as read', async () => {
    renderApp();
    const book = await screen.findByText('It');
    fireEvent.click(book);
    await waitFor(() => {
      expect(book).toHaveStyle('text-decoration: line-through');
    });
  });

  test('GET_BOOK - get the favorite book Jurassic Park', async () => {
    renderApp();
    await screen.findByText('It');
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('Jurassic Park')).toBeInTheDocument();
  });
});
