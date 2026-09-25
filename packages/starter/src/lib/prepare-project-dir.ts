import chalk from 'chalk';
import { mkdirp } from 'mkdirp';
import fs from 'node:fs';
import path from 'node:path';

import type { State } from './wizard.js';

import { showError } from '../utils/error.js';
import { createPackageJSON, writePackageJSON } from '../utils/project.js';
import { gitInit } from './git-init.js';

export const hasExample = ({ appType }: Pick<State, 'appType'>): boolean =>
  appType === 'library' || appType === 'component';

// Creates the project folder, the example project of a library or component, git and `src`.
// Returns the example project path.
export const prepareProjectDir = async (currentPath: string, state: State): Promise<string> => {
  await mkdirp(currentPath);

  const examplePath = path.resolve(currentPath, 'example');

  if (hasExample(state)) {
    try {
      fs.mkdirSync(examplePath);
    } catch (e) {
      showError(e, () => {
        console.error(`Step: 0.1. example folder for app type ${String(state.appType)} creating`);
      });
    }

    try {
      await writePackageJSON(examplePath, createPackageJSON(`${state.projectName ?? ''}-example`));
    } catch (e) {
      showError(e, () => {
        console.error('Step: 1. package.json creating');
      });
    }
  }

  console.log(`${chalk.green('package.json')} created\n`);

  try {
    if (!fs.existsSync(path.join(currentPath, '.git'))) {
      gitInit(currentPath, state);
    } else {
      console.log('GIT is already initialized');
    }
  } catch (e) {
    showError(e, () => {
      console.error('Step: 2. GIT init fail');
    });
  }

  try {
    fs.mkdirSync(path.resolve(currentPath, 'src'));
  } catch (e) {
    showError(e, () => {
      console.error('Step: 3. src folder creating');
    });
  }

  console.log(`${chalk.green('src')} folder created\n`);

  return examplePath;
};
