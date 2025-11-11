import child_process from 'node:child_process';

import { argv } from './argv.js';

export const yarnIsAvailable = () => {
  if (!argv.yarn) {
    return false;
  }
  try {
    child_process.execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

export const getPMVersion = () => {
  if (yarnIsAvailable()) {
    return child_process.execSync('yarnpkg --version').toString();
  }
  return child_process.execSync('npm -v').toString();
};

export const getPM = () => {
  if (yarnIsAvailable()) {
    return 'yarn';
  }
  return 'npm';
};
