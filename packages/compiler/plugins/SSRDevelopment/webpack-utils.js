const path = require('node:path');

const getOutputFileMeta = (compilation, outputPath) => {
  const outputFileName = Object.keys(compilation.assets).find((file) => path.extname(file) === '.js');
  const absoluteFileName = path.join(outputPath, outputFileName);

  return path.relative('', absoluteFileName);
};

module.exports = {
  getOutputFileMeta,
};
