const { argv } = require('yargs');
const { getMajorVersion } = require('@rockpack/utils');
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

const getPM = () => {
  if (yarnIsAvailable()) {
    return 'yarn';
  }
  return 'npm';
}

const isNpm7 = () => {
  const pm = getPM();
  const pmVersion = getMajorVersion(getPMVersion());

  return pm === 'npm' && pmVersion === 7;
}

module.exports = {
  yarnIsAvailable,
  getPMVersion,
  getPM,
  isNpm7
}
