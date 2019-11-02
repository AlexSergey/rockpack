import fetch from 'isomorphic-fetch';

export function fetchPostsService() {
    return () => fetch( `${process.env.MOCK_SERVER_HOST}:${process.env.MOCK_SERVER_PORT}/posts`)
        .then( res => res.json());
}
