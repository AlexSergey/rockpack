import confirm from '@inquirer/confirm';
import select from '@inquirer/select';
import chalk from 'chalk';

import { isPromptExit } from '../utils/prompt-exit.js';

export type AppType = 'component' | 'csr' | 'library' | 'ssr';

export type State = {
  appType: AppType | undefined;
  nogit?: boolean;
  offline?: boolean;
  projectName?: string;
  tester: boolean | undefined;
  testMode?: boolean;
};

type WizardArgs = {
  appType?: AppType;
  tests?: boolean;
  yes?: boolean;
};

// A closed prompt ends the CLI; any other prompt failure leaves the answer unset.
const rethrowPromptExit = (error: unknown): void => {
  if (isPromptExit(error)) {
    throw error;
  }
};

// --yes answers every question that has no flag with its default.
const DEFAULT_APP_TYPE: AppType = 'csr';
const DEFAULT_TESTER = true;

export const wizard = async (args: WizardArgs): Promise<State> => {
  let appType = args.appType ?? (args.yes ? DEFAULT_APP_TYPE : undefined);
  let tester = args.tests ?? (args.yes ? DEFAULT_TESTER : undefined);

  console.log();
  console.log(`Hello there! ${chalk.bold('Rockpack')} greets you!`);
  console.log(`${chalk.bold('Rockpack')} helps you set up React applications extremely fast.`);
  console.log(
    'All scaffolded applications include Typescript, ESLint with best configurations, Stylelint, Prettier, lint-staged, git hooks, etc.',
  );
  console.log();

  if (typeof appType === 'undefined') {
    try {
      const choices: { name: string; value: AppType }[] = [
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
      ];
      appType = await select({
        choices,
        message: 'Which is type of application would you build?',
      });
    } catch (error) {
      rethrowPromptExit(error);
    }
  }

  if (typeof tester === 'undefined') {
    try {
      tester = await confirm({ message: 'Do you want tests?' });
    } catch (error) {
      rethrowPromptExit(error);
    }
  }

  return {
    appType,
    tester,
  };
};
