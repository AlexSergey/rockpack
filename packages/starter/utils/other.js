const child_process = require('child_process');

const yarnIsAvailable = () => {
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
