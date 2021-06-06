const { argv } = require('yargs');

const setMode = () => {
  let mode = argv.mode;
  mode = ['development', 'production', 'test'].indexOf(mode) >= 0 ? mode : 'test';
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
};

module.exports = {
  setMode
};
