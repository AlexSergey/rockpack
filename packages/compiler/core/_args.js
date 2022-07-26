const { argv } = require('yargs');

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
