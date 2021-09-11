const { argv } = require('yargs');
const fpPromise = require('../utils/findFreePort');

const makeDevServer = async (conf) => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept'
  },
  port: conf.port || await fpPromise(3000),
  //hot: true,
  open: !argv._rockpack_testing,
  historyApiFallback: true,
  host: 'localhost'
});

module.exports = makeDevServer;
