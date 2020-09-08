const path = require('path');

const makeOutput = (conf = {}, root) => {
  const outputProps = {
    pathinfo: false,
    publicPath: '/',
    path: path.resolve(root, conf.dist),
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
