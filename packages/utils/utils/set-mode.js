const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const setMode = (modes, defaultMode) => {
  let mode = defaultMode;
  if (typeof argv.mode === 'string') {
    mode = argv.mode;
  } else if (typeof process.env.NODE_ENV === 'string') {
    mode = process.env.NODE_ENV;
  }
  mode = modes.indexOf(mode) >= 0 ? mode : defaultMode;
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;

  return mode;
};

module.exports = {
  setMode,
};
