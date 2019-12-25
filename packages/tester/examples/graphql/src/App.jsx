import React, { useState, useEffect } from "react";
import { useGraphql } from './graphql';
import { GET_BOOK, GET_BOOKS, BOOK_READ } from './query.gql';

const App = () => {
    let [books, setBooks] = useState([]);
    let [favorite, setFavorite] = useState(false);
    let client = useGraphql();

    useEffect(() => {
        client.query(GET_BOOKS).then(({ data }) => {
            setBooks(data.data.books);
        });
    }, []);

    return <>
        <div id="books">
            {books.map(book => {
                return <div key={book.id} onClick={() => {
                    client.mutation(BOOK_READ, { id: book.id }).then(({ data }) => {
                        setBooks(data.data.bookRead);
                    });
                }} style={{textDecoration: book.read ? 'line-through' : ''}}>{book.title}</div>
            })}
        </div>
        <button onClick={() => {
            client.mutation(GET_BOOK, { id: '2' }).then(({ data }) => {
                setFavorite(data.data.book);
            });
        }}>Set My Favorite Book</button>
        {favorite && <div>
            <h2>My Favorite book is:</h2>
            <p>{favorite.title}</p>
        </div>}
    </>
};

export default App;
