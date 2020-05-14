const { argv } = require('yargs');
const { run, watch } = require('../tester');

if (argv.watch) {
  watch();
} else {
  run();
}
