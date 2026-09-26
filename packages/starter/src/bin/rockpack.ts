import chalk from 'chalk';
import latestVersion from 'latest-version';
import fs from 'node:fs';
import path from 'node:path';
import semverGt from 'semver/functions/gt.js';
import semverParse from 'semver/functions/parse.js';
import validateNpmPackageName from 'validate-npm-package-name';

import { defaultApp } from '../constants/names.js';
import { here } from '../constants/paths.js';
import { APP_TYPES, getArgs, validateArgs } from '../lib/get-args.js';
import { install } from '../lib/install.js';
import { getArgv } from '../utils/argv.js';
import { ReportedError } from '../utils/error.js';
import { packageJson } from '../utils/package-json.js';
import { getCurrentPath } from '../utils/pathes.js';
import { isPromptExit } from '../utils/prompt-exit.js';

const warnIfOutdated = async (): Promise<void> => {
  let rockpackLatestVersion: string;
  try {
    rockpackLatestVersion = await latestVersion(packageJson.name);
  } catch {
    // Offline or the registry is unavailable: the update check is optional.
    return;
  }
  const parsed = semverParse(rockpackLatestVersion);

  if (parsed?.prerelease.length === 0 && semverGt(rockpackLatestVersion, packageJson.version)) {
    console.warn(chalk.red('WARNING:   A newer Rockpack version is available!'));
    console.log();
    console.log(` => The current available version is ${rockpackLatestVersion}`);
    console.log();
    console.log('Please run:');
    console.log();
    console.log(`  ${chalk.blue('npm i -g @rockpack/starter')}`);
    console.log();
  }
};

// Resolves to the process exit code; the bin sets it.
export const rockpack = async (): Promise<number> => {
  const argv = getArgv();
  const { _, h, help, v, version } = argv;
  const noName = _.length === 0;
  const args = getArgs();

  if (v || version) {
    console.log(`Rockpack v${chalk.green(packageJson.version)}`);

    return 0;
  }

  if (h || help) {
    console.log(chalk.bold('USAGE'));
    console.log(`  ${chalk.underline('rockpack')} <project-name> [options]`);
    console.log();
    console.log(chalk.bold('ARGUMENTS'));
    console.log(
      `  ${chalk.green('<project-name>')}           Project name (a valid npm package name), "." for the current directory`,
    );
    console.log();
    console.log(chalk.bold('OPTIONS'));
    console.log(`  ${chalk.green('--type')}=<type>            Project type: ${APP_TYPES.join(', ')}`);
    console.log(`  ${chalk.green('--tests')}=<boolean>        Add Jest tests: true, false, yes, no, 1 or 0`);
    console.log(
      `  ${chalk.green('--folder')}=<path>          Create the project inside this folder (absolute or relative)`,
    );
    console.log(`  ${chalk.green('--no-install')}             Write the project without installing its dependencies`);
    console.log(`  ${chalk.green('--yarn')}                   Use Yarn instead of npm when it is installed`);
    console.log(
      `  ${chalk.green('--offline')}                Take the dependency versions from the starter, skip the registry and the update check (installing still needs the network)`,
    );
    console.log(
      `  ${chalk.green('-y')} (--yes)               Use the defaults for unanswered questions (csr, with tests)`,
    );
    console.log();
    console.log(chalk.bold('GLOBAL OPTIONS'));
    console.log(`  ${chalk.green('-h')} (--help)              Display this help message`);
    console.log(`  ${chalk.green('-v')} (--version)           Display this application version`);

    return 0;
  }

  if (noName) {
    console.error('Please specify the project directory:');
    console.log(`  rockpack ${chalk.green('<project-directory>')}`);
    console.log();
    console.log('For example:');
    console.log(`  rockpack ${chalk.green('project-name')}`);

    return 1;
  }

  const problems = validateArgs();
  if (problems.length > 0) {
    problems.forEach((problem) => {
      console.error(problem);
    });

    return 1;
  }

  if (!args.testMode && !args.offline) {
    await warnIfOutdated();
  }

  let projectName = String(_[0]);

  const currentPath = getCurrentPath(args.folder ? path.join(args.folder, projectName) : projectName);

  if (projectName !== here && fs.existsSync(currentPath) && !fs.statSync(currentPath).isDirectory()) {
    console.error(
      chalk.red(`"${currentPath}" already exists and is not a folder. Please choose another project name.`),
    );

    return 1;
  }

  if (projectName !== here && fs.existsSync(currentPath) && fs.readdirSync(currentPath).length > 0) {
    console.error(chalk.red(`Project "${projectName}" already exists. Please use manual installation:\n`));
    console.log(
      `${chalk.green('@rockpack/compiler')} - https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md`,
    );
    console.log(
      `${chalk.green('@rockpack/tester')} - https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md`,
    );
    console.log(
      `${chalk.green('@rockpack/codestyle')} - https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md`,
    );

    return 1;
  }

  if (projectName === here) {
    const appName = path.basename(currentPath).toLowerCase().replace(/\s/g, '_');
    projectName = appName.length > 0 ? appName : defaultApp;
  }

  const { errors = [], validForNewPackages, warnings = [] } = validateNpmPackageName(projectName);
  if (!validForNewPackages) {
    console.error(chalk.red(`"${projectName}" is not a valid npm package name:`));
    [...errors, ...warnings].forEach((problem) => {
      console.error(`  - ${problem}`);
    });

    return 1;
  }

  try {
    await install({
      args,
      currentPath,
      projectName,
    });
  } catch (e) {
    if (isPromptExit(e)) {
      return 0;
    }
    if (e instanceof ReportedError) {
      return 1;
    }
    throw e;
  }

  return 0;
};
