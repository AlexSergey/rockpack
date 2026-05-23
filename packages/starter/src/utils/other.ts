import { execSync } from 'node:child_process';

import { argv } from './argv';

export const yarnIsAvailable = (): boolean => {
  if (!argv['yarn']) {
    return false;
  }
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
};

export const getPMVersion = (): string => {
  if (yarnIsAvailable()) {
    return execSync('yarnpkg --version').toString();
  }

  return execSync('npm -v').toString();
};

export const getPM = (): string => {
  if (yarnIsAvailable()) {
    return 'yarn';
  }

  return 'npm';
};
