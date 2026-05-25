import React, { useEffect, useState } from 'react';

import { useGraphql } from './graphql';
import { BOOK_READ, GET_BOOK, GET_BOOKS } from './query.gql';

interface Book {
  author: string;
  id: string;
  read: boolean;
  title: string;
}

export const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [favorite, setFavorite] = useState<Book | false>(false);
  const client = useGraphql();

  useEffect(() => {
    if (client) {
      void client.query(GET_BOOKS).then(({ data }) => {
        setBooks((data as { data: { books: Book[] } }).data.books);
      });
    }
  }, []);

  if (!client) return null;

  return (
    <>
      <div id="books">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => {
              void client.mutation(BOOK_READ, { id: book.id }).then(({ data }) => {
                setBooks((data as { data: { bookRead: Book[] } }).data.bookRead);
              });
            }}
            style={{ textDecoration: book.read ? 'line-through' : '' }}
          >
            {book.title}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          void client.mutation(GET_BOOK, { id: '2' }).then(({ data }) => {
            setFavorite((data as { data: { book: Book } }).data.book);
          });
        }}
        type="button"
      >
        Set My Favorite Book
      </button>
      {favorite && (
        <div>
          <h2>My Favorite book is:</h2>
          <p>{favorite.title}</p>
        </div>
      )}
    </>
  );
};
