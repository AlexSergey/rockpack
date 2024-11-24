const { isUndefined } = require('valid-types');

function commonMultiValidator(props) {
  if (props.length === 0) {
    console.error('The config is empty');

    return process.exit(1);
  }

  props.forEach((prop) => {
    if (isUndefined(prop.compilerName)) {
      console.error('The config is invalid');

      return process.exit(1);
    }

    return false;
  });
}

module.exports = commonMultiValidator;
