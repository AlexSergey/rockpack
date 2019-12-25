import React from "react";
import { render } from "react-dom";
import { Graphql, MockGraphql } from './graphql';
import App from './App';
import { GET_BOOK, GET_BOOKS, BOOK_READ } from './query.gql';

render(
    <Graphql options={{
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
            <App />
        </MockGraphql>
    </Graphql>,
    document.getElementById('root')
);
