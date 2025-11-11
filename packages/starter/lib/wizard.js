import chalk from 'chalk';
import inquirer from 'inquirer';

export const wizard = async (args) => {
  const prompt = inquirer.createPromptModule();
  let appType = args.appType;
  let tester = args.tests;

  console.log(args, appType);
  console.log();
  console.log(`Hello there! ${chalk.bold('Rockpack')} greets you!`);
  console.log(`${chalk.bold('Rockpack')} helps you set up React applications extremely fast.`);
  console.log(
    'All scaffolded applications include Typescript, ESLint with best configurations, Stylelint, Prettier, lint-staged, git hooks, etc.',
  );
  console.log();

  if (!appType) {
    appType = await prompt({
      type: 'list',
      name: 'appType',
      message: 'Which is type of application would you build?',
      choices: [
        {
          name: `• ${chalk.bold('React SPA')}: Preset for a Single Page Application using React`,
          value: 'csr',
          checked: false,
        },
        {
          name: `• ${chalk.bold('React SPA + SSR')}: Preset for a React Single Page Application with Server-Side Rendering`,
          value: 'ssr',
          checked: false,
        },
        {
          name: `• ${chalk.bold('React Component')}: Preset for publishing a reusable React component to NPM`,
          value: 'component',
          checked: false,
        },
        {
          name: `• ${chalk.bold('UMD Library')}: Preset for a vanilla JavaScript UMD library, suitable for NPM publishing`,
          value: 'library',
          checked: false,
        },
      ],
    });
  }

  if (typeof tester === 'undefined') {
    tester = await prompt({
      type: 'confirm',
      name: 'tester',
      message: 'Do you want tests?',
    });
  }

  return {
    appType,
    tester,
  };
};
