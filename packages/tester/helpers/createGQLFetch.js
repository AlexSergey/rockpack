const fetch = require('isomorphic-fetch');

const createGQLFetch = url => async query => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = createGQLFetch;
