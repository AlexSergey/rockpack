import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { getCurrentPath } from '../utils/pathes.js';
import { here } from '../constants/paths.js';
import { defaultApp } from '../constants/names.js';
import { install } from '../lib/install.js';
import latestVersion from 'latest-version';
import semverParse from 'semver/functions/parse.js';
import { argv } from '../utils/argv.js';
import { packageJson } from '../utils/package-json.js';

export const rockpack = async () => {
  const { _, h, help, v, version } = argv;
  const noName = _.length === 0;

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
    console.log(
      `  rockpack ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`  rockpack ${chalk.green('project-name')}`);
    process.exit(1);
  }

  const rockpackLatestVersion = await latestVersion(packageJson.name);

  if (
    semverParse(rockpackLatestVersion).prerelease.length === 0 &&
    rockpackLatestVersion > packageJson.version
  ) {
    console.warn(chalk.red('WARNING:   Your Rockpack version is up to date!'));
    console.log();
    console.log(
      ` => The current available version is ${rockpackLatestVersion}`
    );
    console.log();
    console.log('Please run:');
    console.log();
    console.log(`  ${chalk.blue('npm i -g @rockpack/starter')}`);
    console.log();
  }

  let projectName = String(_[0]);

  const currentPath = getCurrentPath(projectName);

  if (projectName !== here && fs.existsSync(currentPath) && fs.readdirSync(currentPath).length > 0) {
    console.error(chalk.red(`Project "${projectName}" has already created. Please use manual installation:\n`));
    console.log(`${chalk.green('@rockpack/compiler')} - https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md`);
    console.log(`${chalk.green('@rockpack/tester')} - https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md`);
    console.log(`${chalk.green('@rockpack/codestyle')} - https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md`);
    return process.exit(1);
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
    projectName,
    currentPath
  });
};
