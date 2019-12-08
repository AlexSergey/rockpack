const { ApolloServer } = require('apollo-server-express');
const gql = require('graphql-tag');

const books = [
    {
        id: '1',
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
        read: false
    },
    {
        id: '2',
        title: 'Jurassic Park',
        author: 'Michael Crichton',
        read: false
    },
];

const resolvers = {
    Query: {
        books: () => {
            return books;
        },
        book: async (_, { id }, { client }) => {
            return books.find(book => book.id === id);
        }
    },
    Mutation: {
        bookRead: async (_, { id }, { client }) => {
            return books.map(book => {
                book.read = book.id === id ? !book.read : book.read;
                return book;
            });
        }
    }
};

const typeDefs = gql`
    type Book {
        id: String!
        title: String
        author: String
        read: Boolean
    }
    type Query {
        books: [Book]
        book(id: String!): Book
    }
    type Mutation {
        bookRead(id: String!): [Book]
    }
`;

let options = {
    typeDefs,
    resolvers,
    playground: process.env.NODE_ENV === 'development' ? {
        settings: {
            'editor.theme': 'dark'
        }
    } : false
};

const server = new ApolloServer(options);

module.exports = { server, path: '/graphql/' };
