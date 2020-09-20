const child_process = require('child_process');

function yarnIsAvailable() {
  try {
    child_process.execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  yarnIsAvailable
}
