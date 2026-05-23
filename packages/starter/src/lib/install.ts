import chalk from 'chalk';
import { mkdirp } from 'mkdirp';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import type { Args } from './get-args';

import { showError } from '../utils/error';
import { gitHooks } from '../utils/git-hooks';
import { getPM } from '../utils/other';
import { dummies } from '../utils/pathes';
import { createPackageJSON, installDependencies, installPeerDependencies, writePackageJSON } from '../utils/project';
import { copyFiles } from './copy-files.ts';
import { createFiles } from './create-files.ts';
import { gitInit } from './git-init';
import { packageJsonPreparing } from './package-json-preparing.ts';
import { wizard } from './wizard';

interface Timeouts {
  $el1: null | ReturnType<typeof setTimeout>;
  $el2: null | ReturnType<typeof setTimeout>;
  $el3: null | ReturnType<typeof setTimeout>;
}

const clear = (timeouts: Timeouts): void => {
  for (const key of Object.keys(timeouts) as (keyof Timeouts)[]) {
    const t = timeouts[key];
    if (t !== null) clearTimeout(t);
  }
};

export const install = async ({
  args,
  currentPath,
  projectName,
}: {
  args: Args;
  currentPath: string;
  projectName: string;
  // eslint-disable-next-line @sonar/cognitive-complexity
}): Promise<void> => {
  const state = await wizard(args);
  state.projectName = projectName;

  if (args.testMode) {
    state.testMode = args.testMode;
  }
  console.log();

  await mkdirp(currentPath);

  const examplePath = path.resolve(currentPath, 'example');

  if (state.appType === 'library' || state.appType === 'component') {
    try {
      fs.mkdirSync(examplePath);
    } catch (e) {
      showError(e, () => {
        console.error(`Step: 0.1. example folder for app type ${state.appType} creating`);
      });
    }
  }

  let packageJSON = createPackageJSON(projectName);

  try {
    if (state.appType === 'library' || state.appType === 'component') {
      const packageJSONExample = createPackageJSON(`${projectName}-example`);
      await writePackageJSON(examplePath, packageJSONExample);
    }
  } catch (e) {
    showError(e, () => {
      console.error('Step: 1. package.json creating');
    });
  }

  console.log(`${chalk.green('package.json')} created\n`);

  const src = path.resolve(currentPath, 'src');

  try {
    if (!fs.existsSync(path.join(currentPath, '.git'))) {
      gitInit(currentPath, state);
    } else {
      console.log('GIT is already initialized');
    }
  } catch (e) {
    showError(e, () => {
      console.error('Step: 2. GIT init fail');
    });
  }

  try {
    fs.mkdirSync(src);
  } catch (e) {
    showError(e, () => {
      console.error('Step: 3. src folder creating');
    });
  }

  console.log(`${chalk.green('src')} folder created\n`);

  if (!state.nogit) {
    try {
      const gitignore = fs.readFileSync(path.join(dummies, 'gitignore'), 'utf8');
      fs.writeFileSync(path.join(currentPath, '.gitignore'), gitignore.toString());
      const gitattributes = fs.readFileSync(path.join(dummies, 'gitattributes'), 'utf8');
      fs.writeFileSync(path.join(currentPath, '.gitattributes'), gitattributes.toString());
    } catch (e) {
      showError(e, () => {
        console.error('Step: 4.1. .gitignore creating');
      });
    }

    console.log(`${chalk.green('.gitignore')} created\n`);
  }

  if (state.appType === 'library' || state.appType === 'component') {
    try {
      const npmignore = fs.readFileSync(path.join(dummies, 'npmignore'), 'utf8');
      fs.writeFileSync(path.join(currentPath, '.npmignore'), npmignore.toString());
    } catch (e) {
      showError(e, () => {
        console.error('Step: 4.2. .npmignore creating');
      });
    }

    console.log(`${chalk.green('.npmignore')} created\n`);
  }

  const spinner = ora('package.json is preparing. Dependencies are checking.\n').start();

  try {
    packageJSON = await packageJsonPreparing(packageJSON, state, currentPath);
  } catch (e) {
    spinner.stop();
    showError(e, () => {
      console.error('Step: 5. package.json set-up');
    });
  }

  spinner.text = 'Files are copying and creating.';

  try {
    await copyFiles(currentPath, state);
  } catch (e) {
    spinner.stop();
    showError(e, () => {
      console.error('Step: 6. Copying files');
    });
  }

  try {
    createFiles(currentPath, state);
  } catch (e) {
    spinner.stop();
    showError(e, () => {
      console.error('Step: 7. Creating files');
    });
  }

  spinner.text = 'Project is initializing. It takes 2-5 minutes.';

  const timeouts: Timeouts = { $el1: null, $el2: null, $el3: null };

  timeouts.$el1 = setTimeout(() => {
    spinner.text = 'Dependencies are installing. It takes 1-2 minutes.';
    timeouts.$el2 = setTimeout(() => {
      spinner.text = 'The developer dependencies are installing. Please wait.';
      timeouts.$el3 = setTimeout(() => {
        spinner.text = 'Almost everything is ready. Less than a minute remaining.';
      }, 60 * 1000);
    }, 60 * 1000);
  }, 60 * 1000);

  try {
    await writePackageJSON(currentPath, packageJSON);
  } catch (e) {
    spinner.stop();
    clear(timeouts);
    showError(e, () => {
      console.error('Step: 8. package.json updating');
    });
  }

  if (args.noInstall) {
    spinner.stop();
    clear(timeouts);
    console.log();
    console.log(chalk.green(`Project "${projectName}" was created successfully!`));
    process.exit();
  }

  try {
    await installDependencies(currentPath);

    if (state.appType === 'library' || state.appType === 'component') {
      await installDependencies(examplePath);

      if (state.appType === 'component' && packageJSON['peerDependencies']) {
        await installPeerDependencies(packageJSON, currentPath);
      }
    }

    if (!state.nogit) {
      gitHooks(state, currentPath);
    }
  } catch (e) {
    spinner.stop();
    clear(timeouts);
    showError(e, () => {
      console.error('Step: 9. Installing dependencies');
    });
  }

  spinner.stop();
  clear(timeouts);

  console.log();
  console.log(chalk.green(`Project "${projectName}" was created successfully!`));
  console.log();
  console.log(`Go to "${projectName}" folder`);
  console.log(chalk.blue(`cd ${projectName}`));
  console.log('and run commands');
  console.log();
  console.log(chalk.yellow('COMMANDS:'));
  console.log();
  console.log(chalk.magenta('  Building project:'));

  if (state.appType === 'library' || state.appType === 'component') {
    console.log(`${chalk.blue(`cd example`)} && ${chalk.blue(`${getPM()} start`)} - run dev mode`);
  } else {
    console.log(`${chalk.blue(`${getPM()} start`)} - run dev mode`);
  }

  console.log(`${chalk.blue(`${getPM()} run build`)} - build production`);

  if (state.tester) {
    console.log();
    console.log(chalk.magenta('  Testing project:'));
    console.log(`${chalk.blue(`${getPM()} test`)} - run tests`);
    console.log(`${chalk.blue(`${getPM()} run test:watch`)} - run tests in dev mode`);
  }

  console.log();
  console.log(chalk.magenta('  ESLint checking:'));
  console.log(`${chalk.blue(`${getPM()} run lint`)} - check ESLint rules`);

  if (!state.nogit) {
    console.log();
    console.log(chalk.magenta('  GIT add origin:'));
    console.log(chalk.blue('git remote add origin <url>'));
    console.log('pre-commit, pre-push hooks added');
  }

  console.log();
  console.log(chalk.yellow('Thank you for using Rockpack!'));
};
