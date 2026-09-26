import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import type { State } from './wizard.js';

import { showError } from '../utils/error.js';
import { dummies } from '../utils/pathes.js';
import { hasExample } from './prepare-project-dir.js';

const copyDummy = (dummy: string, target: string, extra = ''): void => {
  fs.writeFileSync(target, fs.readFileSync(path.join(dummies, dummy), 'utf8') + extra);
};

// The ssr frontend is built into public/, which holds nothing else.
const extraIgnores = ({ appType }: Pick<State, 'appType'>): string =>
  appType === 'ssr' ? '\n# The frontend build of the ssr app\n/public\n' : '';

// .gitignore and .gitattributes for every project (also inside a parent repository or without git), .npmignore for
// published ones.
export const writeMetaFiles = (currentPath: string, state: Pick<State, 'appType'>): void => {
  try {
    copyDummy('gitignore', path.join(currentPath, '.gitignore'), extraIgnores(state));
    copyDummy('gitattributes', path.join(currentPath, '.gitattributes'));
  } catch (e) {
    showError(e, () => {
      console.error('Step: 4.1. .gitignore creating');
    });
  }

  console.log(`${chalk.green('.gitignore')} created\n`);

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
