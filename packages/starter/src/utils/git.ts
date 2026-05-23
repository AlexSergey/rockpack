import chalk from 'chalk';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const gitIsAvailable = (): boolean => {
  try {
    execSync('git --version', { stdio: 'ignore' });

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
};

export const findGitRepoInParent = (startPath: string): boolean => {
  let currentPath: false | string = startPath;
  let isExists = false;

  while (currentPath) {
    const parentPath = path.resolve(currentPath, '..');
    const gitPath = path.join(currentPath, '.git');
    isExists = fs.existsSync(gitPath);

    if (isExists) {
      currentPath = false;
    } else if (currentPath !== parentPath) {
      currentPath = parentPath;
    } else {
      currentPath = false;
    }
  }

  return isExists;
};

export const makeRepo = (currentPath: string): boolean => {
  try {
    execSync('git init', { cwd: currentPath, stdio: 'ignore' });
    console.log(`${chalk.green('GIT')} initialized`);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
};
