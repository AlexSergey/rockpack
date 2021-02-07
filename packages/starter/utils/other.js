const { argv } = require('yargs');
const child_process = require('child_process');

const yarnIsAvailable = () => {
  if (!argv.yarn) {
    return false;
  }
  try {
    child_process.execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

const getPMVersion = () => {
  if (yarnIsAvailable()) {
    return child_process.execSync('yarnpkg --version')
      .toString()
  }
  return child_process.execSync('npm -v')
    .toString()
}

module.exports = {
  yarnIsAvailable,
  getPMVersion
}
