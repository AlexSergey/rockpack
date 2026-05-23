import chalk from 'chalk';

import type { State } from './wizard';

import { findGitRepoInParent, gitIsAvailable, makeRepo } from '../utils/git';

export const gitInit = (currentPath: string, state: State): void => {
  const git = gitIsAvailable();

  if (!git) {
    console.warn(chalk.red('WARNING:   GIT is not available in the system.'));
    console.log();
    state.nogit = true;

    return;
  }

  const isGitSubmodule = findGitRepoInParent(currentPath);

  if (isGitSubmodule) {
    state.nogit = true;

    return;
  }

  makeRepo(currentPath);
};
