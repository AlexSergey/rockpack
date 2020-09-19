const fs = require('fs');
const chalk = require('chalk');
const { getCurrentPath } = require('../utils/pathes');
const install = require('../lib/install');

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Please specify the project directory:');
    console.log(
      `  rockpack ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`  rockpack ${chalk.green('project-name')}`);
    process.exit(1);
  }

  const projectName = args[0];
  const currentPath = getCurrentPath(projectName);

  if (fs.existsSync(currentPath) && fs.readdirSync(currentPath).length > 0) {
    console.error(chalk.red(`Project "${projectName}" has already created. Please use manual installation:\n`));
    console.log(`${chalk.green('@rockpack/compiler')} - https://github.com/AlexSergey/rock/blob/master/packages/compiler/README.md`);
    console.log(`${chalk.green('@rockpack/ussr')} - https://github.com/AlexSergey/rock/blob/master/packages/ussr/README.md`);
    console.log(`${chalk.green('@rockpack/tester')} - https://github.com/AlexSergey/rock/blob/master/packages/tester/README.md`);
    console.log(`${chalk.green('@rockpack/codestyle')} - https://github.com/AlexSergey/rock/blob/master/packages/codestyle/README.md`);
    console.log(`${chalk.green('@rockpack/logger')} - https://github.com/AlexSergey/rock/blob/master/packages/logger/README.md`);
    console.log(`${chalk.green('@rockpack/localazer')} - https://github.com/AlexSergey/rock/blob/master/packages/localazer/README.md`);
    return process.exit(1);
  }

  await install({
    projectName,
    currentPath
  });
})();
