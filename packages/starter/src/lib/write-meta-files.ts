import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import type { State } from './wizard.js';

import { showError } from '../utils/error.js';
import { dummies } from '../utils/pathes.js';
import { hasExample } from './prepare-project-dir.js';

const copyDummy = (dummy: string, target: string): void => {
  fs.writeFileSync(target, fs.readFileSync(path.join(dummies, dummy), 'utf8'));
};

// .gitignore and .gitattributes for git projects, .npmignore for published ones.
export const writeMetaFiles = (currentPath: string, state: State): void => {
  if (!state.nogit) {
    try {
      copyDummy('gitignore', path.join(currentPath, '.gitignore'));
      copyDummy('gitattributes', path.join(currentPath, '.gitattributes'));
    } catch (e) {
      showError(e, () => {
        console.error('Step: 4.1. .gitignore creating');
      });
    }

    console.log(`${chalk.green('.gitignore')} created\n`);
  }

  if (hasExample(state)) {
    try {
      copyDummy('npmignore', path.join(currentPath, '.npmignore'));
    } catch (e) {
      showError(e, () => {
        console.error('Step: 4.2. .npmignore creating');
      });
    }

    console.log(`${chalk.green('.npmignore')} created\n`);
  }
};
