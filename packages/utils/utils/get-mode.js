const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const getMode = (modes = ['development', 'production'], defaultMode = 'development') => {
  let mode = defaultMode;
  if (typeof argv.mode === 'string') {
    mode = argv.mode;
  } else if (typeof process.env.NODE_ENV === 'string') {
    mode = process.env.NODE_ENV;
  }
  mode = modes.indexOf(mode) >= 0 ? mode : defaultMode;

  return mode;
};

module.exports = {
  getMode,
};
