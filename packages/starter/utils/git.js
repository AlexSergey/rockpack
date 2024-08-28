import chalk from 'chalk';
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const gitIsAvailable = () => {
  try {
    child_process.execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

export const findGitRepoInParent = (currentPath) => {
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
};

export const makeRepo = (currentPath) => {
  try {
    child_process.execSync('git init', { cwd: currentPath, stdio: 'ignore' });
    console.log(`${chalk.green('GIT')} initialized`);
    return true;
  } catch (e) {
    return false;
  }
};
