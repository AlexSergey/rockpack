const { isUndefined } = require('valid-types');

// eslint-disable-next-line consistent-return
function commonMultiValidator(props) {
  if (props.length === 0) {
    // eslint-disable-next-line no-console
    console.error('The config is empty');

    return process.exit(1);
  }

  props.forEach((prop) => {
    if (isUndefined(prop.compilerName)) {
      // eslint-disable-next-line no-console
      console.error('The config is invalid');

      return process.exit(1);
    }

    return false;
  });
}

module.exports = commonMultiValidator;
