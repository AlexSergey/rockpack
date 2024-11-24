const path = require('node:path');

const makeOutput = (conf = {}, root, mode) => {
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);

  const outputProps = {
    clean: true,
    filename: conf.webview ? 'webview-index.js' : '[name].js',
    path: path.dirname(distPath),
    pathinfo: mode === 'development',
    publicPath: '/',
  };

  if (conf.library) {
    Object.assign(outputProps, {
      globalObject: 'globalThis',
      library: conf.library,
      libraryTarget: 'umd',
    });
  }

  return outputProps;
};

module.exports = makeOutput;
