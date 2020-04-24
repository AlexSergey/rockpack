require('dotenv').config();
const express = require('express');
const jsonGraphqlExpress = require('json-graphql-server');

const app = express();
const data = {
  // ... your data
};
app.use('/graphql', jsonGraphqlExpress(data));
app.listen(process.env.MOCK_GRAPHQL_SERVER_PORT);
