const fs = require('fs');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const wizard = require('./wizard');
const copyFiles = require('./copyFiles');
const packageJSONPreparing = require('./packageJSONPreparing');
const {
  readPackageJSON,
  createPackageJSON,
  writePackageJSON,
  installDependencies
} = require('../utils/project');
const {
  yarnIsAvailable
} = require('../utils/other');

const install = async ({
  projectName,
  currentPath
}) => {
  if (!fs.existsSync(currentPath)) {
    fs.mkdirSync(currentPath);
  }

  await createPackageJSON(currentPath);
  console.log(chalk.green('Package.json created'));

  const src = path.resolve(currentPath, 'src');
  fs.mkdirSync(src);
  console.log(chalk.green('Src folder created'));

  const state = await wizard();
  const spinner = ora('Package.json is preparing. Dependencies are checking.')
    .start();

  const packageJSON = await packageJSONPreparing(await readPackageJSON(currentPath), state);

  spinner.text = 'Files are copying';
  await copyFiles(currentPath, state);

  spinner.text = 'Project is initializing... It takes 2 - 5 minutes';
  await writePackageJSON(currentPath, packageJSON);
  await installDependencies(yarnIsAvailable(), currentPath);
  spinner.stop();

  console.log();
  console.log(chalk.green(`Project "${projectName}" was created successfully!`));
  console.log();
  console.log(chalk.yellow('COMMANDS:'));
  console.log();
  console.log(chalk.magenta('  Building project:'));
  console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} start`)} - run dev mode`);
  console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run build`)} - build production`);

  if (state.tester) {
    console.log();
    console.log(chalk.magenta('  Testing project:'));
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} test`)} - run tests`);
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run test:watch`)} - run tests in dev mode`);
  }

  if (state.typescript) {
    console.log();
    console.log(chalk.magenta('  Typescript checking:'));
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run typing`)} - check types`);
  }

  if (state.codestyle) {
    console.log();
    console.log(chalk.magenta('  ESLint checking:'));
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run lint`)} - check ESLint rules`);
  }

  if (state.modules.localization) {
    console.log();
    console.log(chalk.magenta('  Localizing:'));
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run localization:makePot`)} - create POT file`);
    console.log(`${chalk.blue(`${yarnIsAvailable() ? 'yarn' : 'npm'} run localization:po2json`)} - convert PO files to JSON`);
  }

  console.log();
  console.log(chalk.yellow('Thank you for using Rockpack!'));
}

module.exports = install;
