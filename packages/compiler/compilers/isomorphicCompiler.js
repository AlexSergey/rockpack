const { isDefined, isUndefined, isArray } = require('valid-types');
const commonMultiValidators = require('../utils/commonMultiValidators');
const multiCompiler = require('./multiCompiler');
const errors = require('../errors/isomorphicCompiler');
const makeMode = require('../modules/makeMode');
const errorHandler = require('../errorHandler');

async function isomorphicCompiler(props = []) {
  errorHandler();
  commonMultiValidators(props);
  const mode = makeMode();

  const backend = props.find(p => p.compiler.name === 'backendCompiler');

  const frontend = props.find(p => p.compiler.name === 'frontendCompiler');

  if (!frontend) {
    console.error(errors.SUPPORT);
    return process.exit(1);
  }

  if (!backend) {
    console.error(errors.BACKEND_IS_REQUIRED);
    return process.exit(1);
  }

  if (Object.keys(props) <= 1) {
    console.error(errors.SHOULD_SET_MORE_THEN_ONE_COMPILERS);
    return process.exit(1);
  }

  props.forEach(prop => {
    ['dist', 'src'].forEach(option => {
      if (isUndefined(prop.config[option])) {
        console.error(errors.SHOULD_SET_OPTION(prop.compiler.name, option));
        return process.exit(1);
      }
    });
  });

  backend.config.__isIsomorphicBackend = true;

  if (isArray(frontend.config.vendor)) {
    backend.config.__frontendHasVendor = true;
  }

  if (mode === 'development') {
    props.forEach(prop => {
      prop.config.__isIsomorphicStyles = true;
    });
  } else {
    backend.config.__isIsomorphicStyles = true;
  }

  props.forEach(prop => {
    prop.config.__isIsomorphicLoader = true;
  });

  frontend.config.write = isDefined(frontend.config.write) ? frontend.config.write : true;
  frontend.config.html = isDefined(frontend.config.html) ? frontend.config.html : false;

  if (mode === 'development') {
    frontend.config.onlyWatch = isDefined(frontend.config.onlyWatch) ?
      frontend.config.onlyWatch :
      true;
  }

  return await multiCompiler(props);
}

module.exports = isomorphicCompiler;
