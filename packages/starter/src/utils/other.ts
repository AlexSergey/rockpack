import { execSync } from 'node:child_process';

import { readBooleanFlag } from './boolean-flag.js';

// getPM() is asked for every script and install step: yarn is looked up once.
let yarnAvailable: boolean | undefined;

const hasYarn = (): boolean => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });

    return true;
  } catch {
    console.warn('Yarn is not installed, npm is used instead.');

    return false;
  }
};

const yarnIsAvailable = (): boolean => (yarnAvailable ??= readBooleanFlag('yarn') === true && hasYarn());

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
