const WebpackDevServer = require('webpack-dev-server');

const devServer = async ({ compiler, webpackConfig, conf }) => {
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);
  server.startCallback(() => {
    conf.messages.push(`=> Starting server on http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}`);
    conf.messages.push('\n');
  });
};
module.exports = devServer;
