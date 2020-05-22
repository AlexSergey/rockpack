const { argv } = require('yargs');
const run = require('./core/run');
const watch = require('./core/watch');


module.exports = function test(...args) {
  if (argv.watch) {
    watch.apply(this, args);
  } else {
    run.apply(this, args);
  }
};
