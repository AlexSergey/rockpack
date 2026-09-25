import chalk from 'chalk';

import type { State } from './wizard.js';

import { getPM } from '../utils/other.js';
import { hasExample } from './prepare-project-dir.js';

export const printCreated = (projectName: string): void => {
  console.log();
  console.log(chalk.green(`Project "${projectName}" was created successfully!`));
};

export const printSummary = (projectName: string, state: State): void => {
  printCreated(projectName);
  console.log();
  console.log(`Go to "${projectName}" folder`);
  console.log(chalk.blue(`cd ${projectName}`));
  console.log('and run commands');
  console.log();
  console.log(chalk.yellow('COMMANDS:'));
  console.log();
  console.log(chalk.magenta('  Building project:'));

  if (hasExample(state)) {
    console.log(`${chalk.blue(`cd example`)} && ${chalk.blue(`${getPM()} start`)} - run dev mode`);
  } else {
    console.log(`${chalk.blue(`${getPM()} start`)} - run dev mode`);
  }

  console.log(`${chalk.blue(`${getPM()} run build`)} - build production`);

  if (state.tester) {
    console.log();
    console.log(chalk.magenta('  Testing project:'));
    console.log(`${chalk.blue(`${getPM()} test`)} - run tests`);
    console.log(`${chalk.blue(`${getPM()} run test:watch`)} - run tests in dev mode`);
  }

  console.log();
  console.log(chalk.magenta('  ESLint checking:'));
  console.log(`${chalk.blue(`${getPM()} run lint`)} - check ESLint rules`);

  if (!state.nogit) {
    console.log();
    console.log(chalk.magenta('  GIT add origin:'));
    console.log(chalk.blue('git remote add origin <url>'));
    console.log('pre-commit, pre-push hooks added');
  }

  console.log();
  console.log(chalk.yellow('Thank you for using Rockpack!'));
};
