import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import { Graphql, MockGraphql } from './graphql';
import { GET_BOOK, GET_BOOKS, BOOK_READ } from './query.gql';

let container;

beforeEach(async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    ReactDOM.render(
      <Graphql options={{
        baseURL: 'http://localhost:4000/graphql/'
      }}
      >
        <MockGraphql mocks={[
          {
            query: GET_BOOKS,
            data: [
              {
                id: '1',
                title: 'It',
                author: 'S. King',
                read: false
              }
            ]
          },
          {
            query: BOOK_READ,
            data() {
              return [
                {
                  id: '1',
                  title: 'It',
                  author: 'S. King',
                  read: true
                }
              ];
            }
          },
          {
            query: GET_BOOK,
            data: {
              id: '2',
              title: 'Jurassic Park',
              author: 'Michael Crichton',
              read: false
            }
          }
        ]}
        >
          <App />
        </MockGraphql>
      </Graphql>, container
    );
  });
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('Test queries', () => {
  test('GET_BOOKS - get the array of books with the book It', () => {
    expect(document.getElementById('books').childNodes[0].innerHTML)
      .toBe('It');
  });

  test('BOOK_READ - set the book It as readed', async () => {
    const it = document.getElementById('books').childNodes[0];
    await act(async () => {
      it.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(getComputedStyle(it, null)['text-decoration'])
      .toBe('line-through');
  });

  test('GET_BOOK - get the favorite book Jurassic Park', async () => {
    const button = document.getElementsByTagName('button')[0];
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const favorite = document.getElementsByTagName('h2')[0].nextSibling;

    expect(favorite.innerHTML)
      .toBe('Jurassic Park');
  });
});
