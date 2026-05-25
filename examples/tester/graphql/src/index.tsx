import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { Graphql, MockGraphql } from './graphql';
import { BOOK_READ, GET_BOOK, GET_BOOKS } from './query.gql';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Graphql options={{ baseURL: 'http://localhost:4000/graphql/' }}>
    <MockGraphql
      mocks={[
        { data: [{ author: 'S. King', id: '1', read: false, title: 'It' }], query: GET_BOOKS },
        { data: () => [{ author: 'S. King', id: '1', read: Math.random() >= 0.5, title: 'It' }], query: BOOK_READ },
        { data: { author: 'Michael Crichton', id: '2', read: false, title: 'Jurassic Park' }, query: GET_BOOK },
      ]}
    >
      <App />
    </MockGraphql>
  </Graphql>,
);
