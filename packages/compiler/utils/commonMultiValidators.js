const { isUndefined, isEmptyObject } = require('valid-types');

const compilers = [
  'frontendCompiler',
  'analyzerCompiler',
  'backendCompiler',
  'libraryCompiler',
  'markupCompiler'
];

function commonMultiValidator(props) {
  if (props.length === 0) {
    console.error('The config is empty');
    return process.exit(1);
  }

  props.forEach(prop => {
    if (isUndefined(prop.compiler) || isUndefined(prop.config) || isEmptyObject(prop.config)) {
      console.error('The config is invalid');
      return process.exit(1);
    }
  });

  props.forEach(prop => {
    prop.compilerName = prop.compiler.name;

    if (compilers.indexOf(prop.compilerName) < 0) {
      console.error('The config is invalid');
      return process.exit(1);
    }
  });
}

module.exports = commonMultiValidator;
