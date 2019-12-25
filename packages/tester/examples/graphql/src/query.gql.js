import gql from 'graphql-tag';

export const GET_BOOKS = gql`
    query Books {
        books {
            id
            title
            read
        }
    }
`;

export const GET_BOOK = gql`
    query Book($id: String!) {
        book(id: $id) {
            id
            title
            read
        }
    }
`;

export const BOOK_READ = gql`
    mutation BookRead($id: String!) {
        bookRead(id: $id) {
            id
            title
            read
        }
    }
`;
