const fs = require('fs');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const wizard = require('./wizard');
const copyFiles = require('./copyFiles');
const createFiles = require('./createFiles');
const packageJSONPreparing = require('./packageJSONPreparing');
const { showError } = require('../utils/error');
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
  try {
    await createPackageJSON(currentPath);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 1. Package.json creating');
    });
  }

  console.log(chalk.green('Package.json created\n'));

  const src = path.resolve(currentPath, 'src');

  try {
    fs.mkdirSync(src);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 2. src folder creating');
    });
  }

  console.log(chalk.green('Src folder created\n'));

  const state = await wizard();
  const spinner = ora('Package.json is preparing. Dependencies are checking.\n')
    .start();

  let packageJSON;

  try {
    packageJSON = await readPackageJSON(currentPath);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 3. Package.json reading');
    });
  }

  try {
    packageJSON = await packageJSONPreparing(packageJSON, state);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 4. Package.json set-up');
    });
  }

  spinner.text = 'Files are copying and creating';

  try {
    await copyFiles(currentPath, state);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 5. Copying files');
    });
  }

  try {
    await createFiles(currentPath, state);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 6. Creating folders');
    });
  }

  spinner.text = 'Project is initializing... It takes 2 - 5 minutes\n';

  try {
    await writePackageJSON(currentPath, packageJSON);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 7. Package.json updating');
    });
  }
  try {
    await installDependencies(yarnIsAvailable(), currentPath);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 8. Installing dependencies');
    });
  }

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
