const { argv } = require('yargs');
const run = require('./core/run');
const watch = require('./core/watch');
const { setMode } = require('./utils/setMode');

module.exports = function test(...args) {
  setMode();
  if (argv.watch) {
    watch.apply(this, args);
  } else {
    run.apply(this, args);
  }
};
