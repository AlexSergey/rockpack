import chalk from 'chalk';
import latestVersion from 'latest-version';
import fs from 'node:fs';
import path from 'node:path';
import semverGt from 'semver/functions/gt.js';
import semverParse from 'semver/functions/parse.js';

import { defaultApp } from '../constants/names.js';
import { here } from '../constants/paths.js';
import { APP_TYPES, getArgs } from '../lib/get-args.js';
import { install } from '../lib/install.js';
import { argv } from '../utils/argv.js';
import { packageJson } from '../utils/package-json.js';
import { getCurrentPath } from '../utils/pathes.js';

const warnIfOutdated = async (): Promise<void> => {
  let rockpackLatestVersion: string;
  try {
    rockpackLatestVersion = await latestVersion(packageJson.name);
  } catch {
    // Offline or the registry is unavailable: the update check is optional.
    return;
  }
  const parsed = semverParse(rockpackLatestVersion);

  if (parsed && parsed.prerelease.length === 0 && semverGt(rockpackLatestVersion, packageJson.version)) {
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

export const rockpack = async (): Promise<void> => {
  const { _, h, help, v, version } = argv;
  const noName = ((_ as unknown[]) ?? []).length === 0;
  const args = getArgs();

  if (v || version) {
    console.log(`Rockpack v${chalk.green(packageJson.version)}`);
    process.exit();
  }

  if (h || help) {
    console.log(chalk.bold('USAGE'));
    console.log(`  ${chalk.underline('rockpack')} proj`);
    console.log();
    console.log(chalk.bold('ARGUMENTS'));
    console.log(`  ${chalk.green('<project-name>')}           Project name`);
    console.log();
    console.log(chalk.bold('GLOBAL OPTIONS'));
    console.log(`  ${chalk.green('-h')} (--help)              Display this help message`);
    console.log(`  ${chalk.green('-v')} (--version)           Display this application version`);
    process.exit();
  }

  if (noName) {
    console.error('Please specify the project directory:');
    console.log(`  rockpack ${chalk.green('<project-directory>')}`);
    console.log();
    console.log('For example:');
    console.log(`  rockpack ${chalk.green('project-name')}`);
    process.exit(1);
  }

  if (typeof argv['type'] === 'string' && !(APP_TYPES as string[]).includes(argv['type'])) {
    console.error(`Unknown type "${argv['type']}". Use one of: ${APP_TYPES.join(', ')}`);
    process.exit(1);

    return;
  }

  if (!args.testMode && !args.offline) {
    await warnIfOutdated();
  }

  let projectName = String(_[0]);

  const currentPath = getCurrentPath(args.folder ? path.join(args.folder, projectName) : projectName);

  if (projectName !== here && fs.existsSync(currentPath) && fs.readdirSync(currentPath).length > 0) {
    console.error(chalk.red(`Project "${projectName}" has already created. Please use manual installation:\n`));
    console.log(
      `${chalk.green('@rockpack/compiler')} - https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md`,
    );
    console.log(
      `${chalk.green('@rockpack/tester')} - https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md`,
    );
    console.log(
      `${chalk.green('@rockpack/codestyle')} - https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md`,
    );

    process.exit(1);

    return;
  }

  if (projectName === here) {
    if (fs.existsSync(path.join(currentPath, '.git'))) {
      const folderName = path.basename(currentPath);
      const appName = folderName.replace(/\s/g, '_');
      if (typeof appName === 'string' && appName.length > 0) {
        projectName = appName;
      }
    } else {
      projectName = defaultApp;
    }
  }

  await install({
    args,
    currentPath,
    projectName,
  });
};
