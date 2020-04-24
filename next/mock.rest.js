require('dotenv').config();
const jsonServer = require('json-server');

const config = {
  mocks: {
    port: process.env.MOCK_REST_SERVER_PORT,
    file: 'mocks.json'
  }
};

const server = jsonServer.create();
const router = jsonServer.router(config.mocks.file);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(router);

server.listen(config.mocks.port, () => {
  console.log(`JSON Server is running on port ${process.env.MOCK_SERVER_PORT}`);
});
