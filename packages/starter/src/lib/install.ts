import ora from 'ora';

import type { Args } from './get-args.js';

import { showError } from '../utils/error.js';
import { startProgress } from '../utils/progress.js';
import { createPackageJSON, writePackageJSON } from '../utils/project.js';
import { copyFiles } from './copy-files.js';
import { createFiles } from './create-files.js';
import { installAll } from './install-all.js';
import { packageJsonPreparing } from './package-json-preparing.js';
import { prepareProjectDir } from './prepare-project-dir.js';
import { printCreated, printSummary } from './print-summary.js';
import { wizard } from './wizard.js';
import { writeMetaFiles } from './write-meta-files.js';

const INSTALL_MESSAGES = [
  'Project is initializing. It takes 2-5 minutes.',
  'Dependencies are installing. It takes 1-2 minutes.',
  'The developer dependencies are installing. Please wait.',
  'Almost everything is ready. Less than a minute remaining.',
];

const MESSAGE_INTERVAL_MS = 60 * 1000;

// Every failure is reported by showError, which throws a ReportedError for the CLI to turn into exit code 1.
export const install = async ({
  args,
  currentPath,
  projectName,
}: {
  args: Args;
  currentPath: string;
  projectName: string;
}): Promise<void> => {
  const state = await wizard(args);
  state.projectName = projectName;

  if (args.testMode) {
    state.testMode = args.testMode;
  }
  if (args.offline) {
    state.offline = true;
  }
  console.log();

  const examplePath = await prepareProjectDir(currentPath, state);
  writeMetaFiles(currentPath, state);

  const spinner = ora('package.json is preparing. Dependencies are checking.\n').start();
  let stop = (): void => {
    spinner.stop();
  };

  const step = async <T>(name: string, action: () => Promise<T> | T): Promise<T> => {
    try {
      return await action();
    } catch (e) {
      stop();

      return showError(e, () => {
        console.error(name);
      });
    }
  };

  const packageJSON = await step('Step: 5. package.json set-up', () =>
    packageJsonPreparing(createPackageJSON(projectName), state, currentPath),
  );

  spinner.text = 'Files are copying and creating.';

  await step('Step: 6. Copying files', () => copyFiles(currentPath, state));
  await step('Step: 7. Creating files', () => {
    createFiles(currentPath, state);
  });

  stop = startProgress(spinner, INSTALL_MESSAGES, MESSAGE_INTERVAL_MS);

  await step('Step: 8. package.json updating', () => writePackageJSON(currentPath, packageJSON));

  if (args.noInstall) {
    stop();
    printCreated(projectName);

    return;
  }

  await step('Step: 9. Installing dependencies', () => installAll(currentPath, examplePath, state));

  stop();
  printSummary(projectName, state);
};
