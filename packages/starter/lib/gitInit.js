import chalk from 'chalk';
import { gitIsAvailable, findGitRepoInParent, makeRepo } from '../utils/git.js';

export const gitInit = async (currentPath, state) => {
  const git = gitIsAvailable();

  if (!git) {
    console.warn(chalk.red('WARNING:   GIT is not available in the system.'));
    console.log();
    state.nogit = true;
    return false;
  }

  const isGitSubmodule = findGitRepoInParent(currentPath);

  if (isGitSubmodule) {
    state.nogit = true;
    return false;
  }

  makeRepo(currentPath);
}
