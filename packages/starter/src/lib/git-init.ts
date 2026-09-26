import chalk from 'chalk';

import type { State } from './wizard.js';

import { findGitRepoInParent, gitIsAvailable, makeRepo } from '../utils/git.js';

export const gitInit = (currentPath: string, state: State): void => {
  const git = gitIsAvailable();

  if (!git) {
    console.warn(chalk.red('WARNING:   GIT is not available in the system.'));
    console.log();
    state.nogit = true;

    return;
  }

  // The project belongs to the parent repository: no nested repository and no hooks of its own.
  const insideParentRepo = findGitRepoInParent(currentPath);

  if (insideParentRepo) {
    state.nogit = true;

    return;
  }

  makeRepo(currentPath);
};
