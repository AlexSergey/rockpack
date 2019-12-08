import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import gql from 'graphql-tag';
import { Graphql, useGraphql, MockGraphql } from '../../../../src';

const GET_BOOKS = gql`
    query Books {
        books {
            id
            title
            read
        }
    }
`;
const GET_BOOK = gql`
    query Book($id: String!) {
        book(id: $id) {
            id
            title
            read
        }
    }
`;
const BOOK_READ = gql`
    mutation BookRead($id: String!) {
        bookRead(id: $id) {
            id
            title
            read
        }
    }
`;

const Inner = () => {
    let [books, setBooks] = useState([]);
    let [favorite, setFavorite] = useState(false);
    let client = useGraphql();

    useEffect(() => {
        client.query(GET_BOOKS).then(({ data }) => {
            setBooks(data.data.books);
        });
    }, []);

    return <>
        {books.map(book => {
            return <div key={book.id} onClick={() => {
                client.mutation(BOOK_READ, { id: book.id }).then(({ data }) => {
                    setBooks(data.data.bookRead);
                });
            }} style={{textDecoration: book.read ? 'line-through' : ''}}>{book.title}</div>
        })}
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
render(<Graphql options={{
        baseURL: 'http://localhost:4000/graphql/'
    }}>
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
                data: function({ id }) {
                    console.log(id);
                    return [
                        {
                            id: '1',
                            title: 'It',
                            author: 'S. King',
                            read: Math.random() >= 0.5
                        }
                    ]
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
        ]}>
            <Inner />
        </MockGraphql>
    </Graphql>,
    document.getElementById('root')
);
