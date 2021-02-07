const chalk = require('chalk');
const { gitIsAvailable, findGitRepoInParent, makeRepo } = require('../utils/git');

const gitInit = async (currentPath, state) => {
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

module.exports = gitInit;
