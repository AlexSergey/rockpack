const { setMode } = require('@rockpack/utils');
const { argv } = require('yargs');

const run = require('./core/run');
const watch = require('./core/watch');

module.exports = function test(...args) {
  setMode(['development', 'production', 'test'], 'test');
  if (argv.watch) {
    watch.apply(this, args);
  } else {
    run.apply(this, args);
  }
};
