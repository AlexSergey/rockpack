const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const fpPromise = require('../utils/find-free-port');

const makeDevServer = async (conf) => ({
  devMiddleware: {
    writeToDisk: true,
  },
  headers: {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Origin': '*',
  },
  historyApiFallback: true,
  host: 'localhost',
  hot: true,
  open: !argv._rockpack_testing,
  port: conf.port || (await fpPromise(3000)),
});

module.exports = makeDevServer;
