import chalk from 'chalk';
import os from 'node:os';

import { getPM, getPMVersion } from './other.js';

// Thrown once the failure report is printed; the CLI turns it into exit code 1 without printing it again.
export class ReportedError extends Error {
  constructor(cause: unknown) {
    super('Rockpack could not create the project', { cause });
    this.name = 'ReportedError';
  }
}

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

  throw new ReportedError(e);
};
