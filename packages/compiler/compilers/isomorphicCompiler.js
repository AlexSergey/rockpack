const { isDefined, isUndefined, isArray } = require('valid-types');
const multiCompiler = require('./multiCompiler');
const errors = require('../errors/isomorphicCompiler');
const makeMode = require('../modules/makeMode');
const errorHandler = require('../errorHandler');

async function isomorphicCompiler(...props) {
  errorHandler();
  global.ISOMORPHIC = true;
  global.CONFIG_ONLY = true;

  for (let i = 0, l = props.length; i < l; i++) {
    props[i] = await props[i];
  }
  props = props.map(c => c.conf);

  props.compilerName = isomorphicCompiler.name;
  const mode = makeMode();

  const backend = props.find(p => p.compilerName === 'backendCompiler');

  const frontend = props.find(p => p.compilerName === 'frontendCompiler');

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
      if (isUndefined(prop[option])) {
        console.error(errors.SHOULD_SET_OPTION(prop.compilerName, option));
        return process.exit(1);
      }
    });
  });

  backend.__isIsomorphicBackend = true;
  frontend.__isIsomorphicFrontend = true;

  if (isArray(frontend.vendor)) {
    backend.__frontendHasVendor = true;
  }

  if (mode === 'development') {
    props.forEach(prop => {
      prop.__isIsomorphicStyles = true;
    });
  } else {
    backend.__isIsomorphicStyles = true;
  }

  props.forEach(prop => {
    prop.__isIsomorphicLoader = true;
  });

  frontend.write = isDefined(frontend.write) ? frontend.write : true;
  frontend.html = isDefined(frontend.html) ? frontend.html : false;

  if (mode === 'development') {
    frontend.onlyWatch = isDefined(frontend.onlyWatch) ?
      frontend.onlyWatch :
      true;
  }

  return await multiCompiler.apply(null, props);
}

module.exports = isomorphicCompiler;
