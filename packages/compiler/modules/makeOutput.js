const path = require('path');

const makeOutput = (conf = {}, root) => {
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);

  const outputProps = {
    pathinfo: false,
    publicPath: '/',
    path: path.dirname(distPath),
    filename: '[name].js'
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
