const path = require('path');

const makeOutput = (conf = {}, root, mode) => {
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);

  const outputProps = {
    pathinfo: mode === 'development',
    publicPath: '/',
    path: path.dirname(distPath),
    filename: conf.webview ? 'webview-index.js' : '[name].js',
    clean: true
  };

  if (conf.library) {
    Object.assign(outputProps, {
      library: conf.library,
      libraryTarget: 'umd',
      globalObject: 'this'
    });
  }

  return outputProps;
};

module.exports = makeOutput;
