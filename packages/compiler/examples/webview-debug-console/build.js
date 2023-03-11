const { argv } = require('yargs');
const { webViewCompiler } = require('../../index');

webViewCompiler({
  debug: !!argv.debug
});
