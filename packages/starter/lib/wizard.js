import chalk from 'chalk';
import inquirer from 'inquirer';

export const wizard = async () => {
  const prompt = inquirer.createPromptModule();

  console.log();
  console.log(`Hello there! ${chalk.bold('Rockpack')} greets you!`);
  console.log(`${chalk.bold('Rockpack')} helps you set up React applications extremely fast.`);
  console.log('All scaffolded applications include Typescript, ESLint with best configurations, Stylelint, Prettier, lint-staged, git hooks, etc.');
  console.log();

  const { appType } = await prompt({
    type: 'list',
    name: 'appType',
    message: 'Which is type of application would you build?',
    choices: [
      {
        name: `• ${chalk.bold('React SPA')}: Typescript, Redux Toolkit, Thunk, React-Router, CSS Modules, @loadable, project structure etc`,
        value: 'csr',
        checked: false
      },
      {
        name: `• ${chalk.bold('React SPA + SSR')}: Typescript, SSR, SEO, Redux Toolkit, Thunk, React-Router, CSS Modules, @loadable, project structure etc`,
        value: 'ssr',
        checked: false
      },
      {
        name: `• ${chalk.bold('React Pure')}: Typescript, React, React-Dom`,
        value: 'pure',
        checked: false
      },
      {
        name: `• ${chalk.bold('React Component')}: Starter for creating React Component with Typescript`,
        value: 'component',
        checked: false
      },
      {
        name: `• ${chalk.bold('UMD Library')}: Starter for creating UMD Library with Typescript`,
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

  const { tester } = await prompt({
    type: 'confirm',
    name: 'tester',
    message: 'Do you want tests?'
  });

  return {
    appType,
    tester,
  }
}
