const path = require('path');
const yargs = require('yargs');
const { isString } = require('valid-types');
const unparse = require('yargs-unparser');
const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const createPaths = require('../modules/createPaths');
const compileSrc = require('../modules/mergeSrc');

module.exports = function argsCompilers(opts = {}, mode) {
  const options = deepExtend({}, defaultProps, opts);
  const rootFolder = path.resolve(__dirname, '..');
  const { rootProjectFolder, src } = createPaths(options);
  const extraArgs = process.argv.slice(2);

  let argv = [];
  argv.push(`--rootDir="${rootProjectFolder}"`);
  if (isString(options.configPath)) {
    argv.push(`--config="${options.configPath}"`);
  } else {
    argv.push(`--config="${rootFolder}/configs/jest.config.js"`);
  }
  compileSrc(argv, src, options);
  argv.push('--runInBand');

  if (mode === 'watch') {
    argv.push('--watchAll');
    argv.push('--runInBand');
    argv.push('--no-cache');
  } else if (mode === 'run') {
    argv.push('--forceExit');
  }

  if (Array.isArray(extraArgs) && extraArgs.length > 0) {
    const unparsedArgv = unparse(yargs.argv);
    argv = argv.concat(unparsedArgv);
  }

  return argv;
};
