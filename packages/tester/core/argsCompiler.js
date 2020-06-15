const path = require('path');
const { isString } = require('valid-types');
const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const createPaths = require('../modules/createPaths');
const compileSrc = require('../modules/compileSrc');

module.exports = function argsCompilers(opts = {}, mode) {
  const options = deepExtend({}, defaultProps, opts);
  const rootFolder = path.resolve(__dirname, '..');
  const { rootProjectFolder, src } = createPaths(options);

  let argv = ` --rootDir="${rootProjectFolder}"`;

  if (isString(options.configPath)) {
    argv += ` --config="${options.configPath}"`;
  } else {
    argv += ` --config="${rootFolder}/configs/jest.config.js"`;
  }

  argv = compileSrc(argv, src, options);

  if (mode === 'watch') {
    argv += ' --watchAll';
    argv += ' --runInBand';
    argv += ' --no-cache';
  } else if (mode === 'run') {
    argv += ' --forceExit';
  }

  return argv;
};
