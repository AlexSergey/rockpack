const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const addArgs = (conf) => {
  if (argv.analyzer) {
    if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      conf.analyzer = false;
    } else {
      conf.analyzer = true;
    }
  }

  return conf;
};

module.exports = addArgs;
