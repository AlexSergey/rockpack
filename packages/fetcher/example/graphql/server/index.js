const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { server, path } = require('./api');
const app = express();

app.use(cors());
app.use(bodyParser.json());

server.applyMiddleware({ app, path });

app.listen(4000, () => {
    console.log(`Server is listening on ${4000}`);
});
