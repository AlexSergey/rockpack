const fetch = require('isomorphic-fetch');

const createGQLFetch = url => async query => {
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query)
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let body = await response.json();
        return body;
    }
    catch (e) {
        throw Error(e);
    }
};

module.exports = createGQLFetch;
