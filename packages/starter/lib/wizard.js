const chalk = require('chalk');
const inquirer = require('inquirer');

const wizard = async () => {
  const prompt = inquirer.createPromptModule();

  const { appType } = await prompt({
    type: 'list',
    name: 'appType',
    message: 'Which is type of application would you build?',
    choices: [
      {
        name: `• ${chalk.bold('React SPA')}: Redux, Thunk, React-Router, CSS Modules, @loadable, project structure etc`,
        value: 'csr',
        checked: false
      },
      {
        name: `• ${chalk.bold('React SPA + SSR')}: SSR, SEO, Redux, Thunk, React-Router, CSS Modules, @loadable, project structure etc`,
        value: 'ssr',
        checked: false
      },
      {
        name: `• ${chalk.bold('React Component')}: Starter for creating React Component`,
        value: 'component',
        checked: false
      },
      {
        name: `• ${chalk.bold('UMD Library')}: Starter for creating UMD Library`,
        value: 'library',
        checked: false
      },
      /*{
        name: '• Node.js Application',
        value: 'nodejs',
        checked: false
      }*/
    ]
  });

  const { typescript } = await prompt({
    type: 'confirm',
    name: 'typescript',
    message: 'Do you want Typescript support?'
  });

  const { tester } = await prompt({
    type: 'confirm',
    name: 'tester',
    message: 'Do you want tests?'
  });

  const { codestyle } = await prompt({
    type: 'confirm',
    name: 'codestyle',
    message: 'Do you want code quality tools: ESLint, Prettier, etc?'
  });

  return {
    appType,
    typescript,
    tester,
    codestyle
  }
}

module.exports = wizard;
