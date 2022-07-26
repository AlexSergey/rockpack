const fetch = require('isomorphic-fetch');

const createGqlFetch = (url) => async (query) => {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = createGqlFetch;
