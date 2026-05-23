import chalk from 'chalk';
import os from 'node:os';

import { getPM, getPMVersion } from './other';

export const showError = (e: unknown, cb?: () => void): never => {
  console.log();
  console.error(chalk.red('Something went wrong. Please create an issue here and provide more details:'));
  console.log(chalk.blue('https://github.com/AlexSergey/rockpack/issues'));
  console.log();
  console.log(chalk.underline.bold('Details: '));
  console.log();
  console.log(e);
  console.log();
  if (cb) {
    cb();
  }
  console.log();
  console.log(`OS: ${os.type()}, ${os.release()}, ${os.platform()}`);
  console.log(`NodeJS version: ${process.versions.node}`);
  console.log(`Package manager: ${getPM()}. version: ${getPMVersion()}`);
  console.log();

  return process.exit(1);
};
