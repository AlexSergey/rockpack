const os = require('os');
const chalk = require('chalk');
const {
  getPMVersion,
  getPM
} = require('../utils/other');

const showError = (e, cb) => {
  console.log();
  console.error(chalk.red('Something went wrong. Please create an issue here and provide more details:'));
  console.log(chalk.blue('https://github.com/AlexSergey/rockpack/issues'));
  console.log();
  console.log(chalk.underline.bold('Details: '));
  console.log();
  console.log(e);
  console.log();
  if (typeof cb === 'function') {
    cb();
  }
  console.log();
  console.log(`OS: ${os.type()}, ${os.release()}, ${os.platform()}`);
  console.log(`NodeJS version: ${process.versions.node}`);
  console.log(`Package manager: ${getPM()}. version: ${getPMVersion()}`);
  console.log();
  process.exit(1);
}

module.exports = {
  showError
}
