import { execSync } from 'node:child_process';

import { readBooleanFlag } from './boolean-flag.js';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

type OptionalPackageManager = Exclude<PackageManager, 'npm'>;

const VERSION_COMMANDS: Readonly<Record<PackageManager, string>> = {
  npm: 'npm -v',
  pnpm: 'pnpm --version',
  yarn: 'yarnpkg --version',
};

const DISPLAY_NAMES: Readonly<Record<OptionalPackageManager, string>> = {
  pnpm: 'pnpm',
  yarn: 'Yarn',
};

// getPM() is asked for every script and install step: the requested package manager is looked up once.
let packageManager: PackageManager | undefined;

const isInstalled = (pm: OptionalPackageManager): boolean => {
  try {
    execSync(VERSION_COMMANDS[pm], { stdio: 'ignore' });

    return true;
  } catch {
    console.warn(`${DISPLAY_NAMES[pm]} is not installed, npm is used instead.`);

    return false;
  }
};

// The CLI rejects --yarn together with --pnpm before anything asks for the package manager.
const requested = (): OptionalPackageManager | undefined => {
  if (readBooleanFlag('yarn') === true) {
    return 'yarn';
  }
  if (readBooleanFlag('pnpm') === true) {
    return 'pnpm';
  }

  return undefined;
};

const choose = (): PackageManager => {
  const pm = requested();

  return pm !== undefined && isInstalled(pm) ? pm : 'npm';
};

export const getPM = (): PackageManager => (packageManager ??= choose());

export const getPMVersion = (): string => execSync(VERSION_COMMANDS[getPM()]).toString();
