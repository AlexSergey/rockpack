const fs = require('fs');
const chalk = require('chalk');
const { getCurrentPath } = require('../utils/pathes');
const install = require('../lib/install');
const packageJSON = require('../package.json');
const latestVersion = require('latest-version');
const { argv } = require('yargs');

(async () => {
  const { _, h, help, v, version } = argv;
  const noName = _.length === 0;

  if (v || version) {
    console.log(`Rockpack v${chalk.green(packageJSON.version)}`);
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

  const rockpackLatestVersion = await latestVersion(packageJSON.name);

  if (packageJSON.version !== rockpackLatestVersion) {
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

  const projectName = _[0];

  const currentPath = getCurrentPath(projectName);

  if (fs.existsSync(currentPath) && fs.readdirSync(currentPath).length > 0) {
    console.error(chalk.red(`Project "${projectName}" has already created. Please use manual installation:\n`));
    console.log(`${chalk.green('@rockpack/compiler')} - https://github.com/AlexSergey/rockpack/blob/master/packages/compiler/README.md`);
    console.log(`${chalk.green('@rockpack/ussr')} - https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md`);
    console.log(`${chalk.green('@rockpack/tester')} - https://github.com/AlexSergey/rockpack/blob/master/packages/tester/README.md`);
    console.log(`${chalk.green('@rockpack/codestyle')} - https://github.com/AlexSergey/rockpack/blob/master/packages/codestyle/README.md`);
    console.log(`${chalk.green('@rockpack/logger')} - https://github.com/AlexSergey/rockpack/blob/master/packages/logger/README.md`);
    console.log(`${chalk.green('@rockpack/localazer')} - https://github.com/AlexSergey/rockpack/blob/master/packages/localazer/README.md`);
    return process.exit(1);
  }

  await install({
    projectName,
    currentPath
  });
})();
