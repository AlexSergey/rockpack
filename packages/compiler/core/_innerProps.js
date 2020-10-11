const { isDefined } = require('valid-types');

const _innerProps = async (conf, mode) => {
  conf.messages = [];
  if (global.ISOMORPHIC) {
    switch (conf.compilerName) {
      case 'backendCompiler':
        conf.__isIsomorphicLoader = true;
        conf.__isIsomorphicBackend = true;
        conf.__isIsomorphicStyles = true;
        break;

      case 'frontendCompiler':
        if (mode === 'development') {
          conf.__isIsomorphicStyles = true;
          conf.onlyWatch = isDefined(conf.onlyWatch) ?
            conf.onlyWatch :
            true;
        }
        conf.__isIsomorphicLoader = true;
        conf.__isIsomorphicFrontend = true;
        conf.write = isDefined(conf.write) ?
          conf.write :
          true;
        conf.html = isDefined(conf.html) ?
          conf.html :
          false;
        break;
    }
  }

  return conf;
};

module.exports = _innerProps;
