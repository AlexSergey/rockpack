const { isDefined } = require('valid-types');

const _innerProps = async (conf, mode) => {
  conf.messages = [];

  if (global.ISOMORPHIC) {
    // eslint-disable-next-line default-case
    switch (conf.compilerName) {
      case 'backendCompiler':
        conf.__isIsomorphic = true;
        conf.__isIsomorphicBackend = true;
        conf.__isIsomorphicStyles = true;
        break;

      case 'frontendCompiler':
        conf.__isIsomorphic = true;
        if (mode === 'development') {
          conf.__isIsomorphicStyles = true;
        }
        conf.__isIsomorphicFrontend = true;
        conf.html = isDefined(conf.html) ? conf.html : false;
        break;
    }
  }

  return conf;
};

module.exports = _innerProps;
