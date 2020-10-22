const path = require('path');
const { argv } = require('yargs');

const makeDevServer = (conf, root) => {
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);

  return {
    contentBase: path.dirname(distPath),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept'
    },
    disableHostCheck: true,
    port: conf.port || 3000,
    noInfo: true,
    quiet: false,
    lazy: false,
    hot: true,
    inline: true,
    stats: 'minimal',
    overlay: {
      errors: true
    },
    open: !argv._rockpack_testing,
    watchOptions: {
      poll: true,
      aggregateTimeout: 50,
      ignored: /node_modules/
    },
    historyApiFallback: true,
    host: 'localhost'
  };
};

module.exports = makeDevServer;
