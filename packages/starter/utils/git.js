const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const gitIsAvailable = () => {
  try {
    child_process.execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

const findGitRepoInParent = (currentPath) => {
  let isExists = false;
  while (currentPath) {
    let parentPath = path.resolve(currentPath, '..');
    const gitPath = path.join(currentPath, '.git');

    isExists = fs.existsSync(gitPath);

    if (isExists) {
      currentPath = false;
    } else {
      if (currentPath !== parentPath) {
        currentPath = parentPath;
      } else {
        currentPath = false;
      }
    }
  }
  return isExists;
}

const makeRepo = (currentPath) => {
  try {
    child_process.execSync('git init', { stdio: 'ignore', cwd: currentPath });
    return true;
  } catch (e) {
    return false;
  }
}


module.exports = {
  findGitRepoInParent,
  gitIsAvailable,
  makeRepo
}
