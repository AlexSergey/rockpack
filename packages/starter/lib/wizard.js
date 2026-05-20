import chalk from 'chalk';
import inquirer from 'inquirer';
import select from '@inquirer/select';

export const wizard = async (args) => {
  const prompt = inquirer.createPromptModule();
  let appType = args.appType;
  let tester = args.tests;

  console.log();
  console.log(`Hello there! ${chalk.bold('Rockpack')} greets you!`);
  console.log(`${chalk.bold('Rockpack')} helps you set up React applications extremely fast.`);
  console.log(
    'All scaffolded applications include Typescript, ESLint with best configurations, Stylelint, Prettier, lint-staged, git hooks, etc.',
  );
  console.log();

  if (typeof appType === 'undefined') {
    try {
      appType = await select({
        type: 'list',
        message: 'Which is type of application would you build?',
        choices: [
          {
            name: `• ${chalk.bold('React SPA')}: Client-side React app with Webpack, TypeScript, ESLint, and Jest preconfigured - structured for clean AI-assisted development.`,
            value: 'csr',
          },
          {
            name: `• ${chalk.bold('React SPA + SSR')}: Universal React app with SSR, hydration, and a Node.js server - no setup needed, AI-ready from the first commit.`,
            value: 'ssr',
          },
          {
            name: `• ${chalk.bold('React Component')}: NPM-ready React component with TypeScript declarations, optimized bundle, and explicit APIs that AI tools work great with.`,
            value: 'component',
          },
          {
            name: `• ${chalk.bold('UMD Library')}: Framework-agnostic UMD library for NPM, zero configuration required, with quality gates that keep AI-generated code clean.`,
            value: 'library',
          },
        ],
      });
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        process.exit(0);
      }
    }
  }

  if (typeof tester === 'undefined') {
    try {
      tester = (
        await prompt({
          type: 'confirm',
          name: 'tester',
          message: 'Do you want tests?',
        })
      ).tester;
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        process.exit(0);
      }
    }
  }

  return {
    appType,
    tester,
  };
};
