const deepExtend = require('deep-extend');
const path = require('node:path');
const yargs = require('yargs');
const unparse = require('yargs-unparser');

const defaultProps = require('../default-props');
const createPaths = require('../modules/create-paths');
const compileSrc = require('../modules/merge-src');

module.exports = function argsCompiler(opts = {}, mode) {
  const options = deepExtend({}, defaultProps, opts);
  const rootFolder = path.resolve(__dirname, '..');
  const { rootProjectFolder, src } = createPaths(options);
  const extraArgs = process.argv.slice(2);

  let argv = [];
  argv.push(`--rootDir="${rootProjectFolder}"`);
  argv.push(`--config="${rootFolder}/configs/jest.projects.js"`);

  compileSrc(argv, src, options);
  argv.push('--runInBand');

  if (mode === 'watch') {
    argv.push('--watchAll');
    argv.push('--runInBand');
    argv.push('--no-cache');
  }

  if (Array.isArray(extraArgs) && extraArgs.length > 0) {
    const unparsedArgv = unparse(yargs.argv);
    argv = argv.concat(unparsedArgv);
  }

  return argv;
};
