const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();

const { webViewCompiler } = require('../../index');

webViewCompiler({
  debug: !!argv.debug,
});
