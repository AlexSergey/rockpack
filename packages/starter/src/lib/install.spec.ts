import { mkdirp } from 'mkdirp';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import type * as Mocks from '../__fixtures__/mocks.js';
import type { SpinnerMock } from '../__fixtures__/mocks.js';
import type { Args } from './get-args.js';
import type { AppType, State } from './wizard.js';

import { showError } from '../utils/error.js';
import { gitHooks } from '../utils/git-hooks.js';
import { createPackageJSON, installDependencies, writePackageJSON } from '../utils/project.js';
import { copyFiles } from './copy-files.js';
import { createFiles } from './create-files.js';
import { gitInit } from './git-init.js';
import { install } from './install.js';
import { packageJsonPreparing } from './package-json-preparing.js';
import { wizard } from './wizard.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('ora', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').oraModule);
jest.mock('mkdirp', () => ({ mkdirp: jest.fn() }));
jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock('../utils/error.js', () => ({ showError: jest.fn() }));
jest.mock('../utils/git-hooks.js', () => ({ gitHooks: jest.fn() }));
jest.mock('../utils/other.js', () => ({ getPM: (): string => 'npm' }));
jest.mock('../utils/pathes.js', () => ({ dummies: '/dummies' }));
jest.mock('../utils/project.js', () => ({
  createPackageJSON: jest.fn(),
  installDependencies: jest.fn(),
  writePackageJSON: jest.fn(),
}));
jest.mock('./copy-files.js', () => ({ copyFiles: jest.fn() }));
jest.mock('./create-files.js', () => ({ createFiles: jest.fn() }));
jest.mock('./git-init.js', () => ({ gitInit: jest.fn() }));
jest.mock('./package-json-preparing.js', () => ({ packageJsonPreparing: jest.fn() }));
jest.mock('./wizard.js', () => ({ wizard: jest.fn() }));

class ShowErrorCalled extends Error {}

const currentPath = '/work/app';
const examplePath = path.resolve(currentPath, 'example');

const mocks = {
  copyFiles: copyFiles as jest.MockedFunction<typeof copyFiles>,
  createFiles: createFiles as jest.MockedFunction<typeof createFiles>,
  createPackageJSON: createPackageJSON as jest.MockedFunction<typeof createPackageJSON>,
  existsSync: fs.existsSync as jest.MockedFunction<typeof fs.existsSync>,
  gitHooks: gitHooks as jest.MockedFunction<typeof gitHooks>,
  gitInit: gitInit as jest.MockedFunction<typeof gitInit>,
  installDependencies: installDependencies as jest.MockedFunction<typeof installDependencies>,
  mkdirp: mkdirp as unknown as jest.Mock,
  mkdirSync: fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>,
  packageJsonPreparing: packageJsonPreparing as jest.MockedFunction<typeof packageJsonPreparing>,
  readFileSync: fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>,
  showError: showError as jest.MockedFunction<typeof showError>,
  wizard: wizard as jest.MockedFunction<typeof wizard>,
  writeFileSync: fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>,
  writePackageJSON: writePackageJSON as jest.MockedFunction<typeof writePackageJSON>,
};
const oraMock = ora as unknown as jest.Mock<SpinnerMock>;

const runInstall = (state: Partial<State> = {}, args: Partial<Args> = {}): Promise<void> => {
  mocks.wizard.mockResolvedValue({ appType: 'csr', tester: true, ...state });

  return install({ args: { testMode: false, ...args }, currentPath, projectName: 'app' });
};

const getSpinner = (): SpinnerMock => {
  const spinner = oraMock.mock.results[0]?.value as SpinnerMock | undefined;
  if (!spinner) {
    throw new Error('spinner was not created');
  }

  return spinner;
};

const reportedStep = (): string | undefined => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  mocks.showError.mock.calls[0]?.[1]?.();
  const step = errorSpy.mock.calls[0]?.[0] as string | undefined;
  errorSpy.mockRestore();

  return step;
};

const callOrder = (): string[] =>
  Object.entries(mocks)
    .flatMap(([name, mock]) => mock.mock.invocationCallOrder.map((order) => ({ name, order })))
    .sort((a, b) => a.order - b.order)
    .map(({ name }) => name)
    .filter((name, index, names) => names[index - 1] !== name);

describe('install', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    oraMock.mockImplementation(jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').createSpinner);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mocks.createPackageJSON.mockImplementation((name) => ({ name }));
    mocks.existsSync.mockReturnValue(false);
    mocks.readFileSync.mockReturnValue('content');
    mocks.packageJsonPreparing.mockImplementation((packageJSON) => Promise.resolve({ ...packageJSON, prepared: true }));
    mocks.showError.mockImplementation(() => {
      throw new ShowErrorCalled();
    });
    mocks.writePackageJSON.mockResolvedValue();
    mocks.installDependencies.mockResolvedValue();
    mocks.copyFiles.mockResolvedValue();
    mocks.mkdirp.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    const failWith = (
      mock: { mockImplementation: (implementation: () => never) => unknown },
      error = new Error('failure'),
    ): void => {
      mock.mockImplementation(() => {
        throw error;
      });
    };

    it.each<[string, AppType, () => void]>([
      [
        'Step: 0.1. example folder for app type library creating',
        'library',
        (): void => {
          mocks.mkdirSync.mockImplementation((dir) => {
            if (dir === examplePath) {
              throw new Error('EEXIST');
            }

            return;
          });
        },
      ],
      [
        'Step: 1. package.json creating',
        'component',
        (): void => void mocks.writePackageJSON.mockRejectedValue(new Error('EACCES')),
      ],
      ['Step: 2. GIT init fail', 'csr', (): void => failWith(mocks.gitInit)],
      [
        'Step: 3. src folder creating',
        'csr',
        (): void => {
          mocks.mkdirSync.mockImplementation((dir) => {
            if (dir === path.resolve(currentPath, 'src')) {
              throw new Error('EEXIST');
            }

            return;
          });
        },
      ],
      ['Step: 4.1. .gitignore creating', 'csr', (): void => failWith(mocks.readFileSync)],
      [
        'Step: 4.2. .npmignore creating',
        'library',
        (): void => {
          mocks.readFileSync.mockImplementation((file) => {
            if (file === path.join('/dummies', 'npmignore')) {
              throw new Error('ENOENT');
            }

            return 'content';
          });
        },
      ],
      [
        'Step: 5. package.json set-up',
        'csr',
        (): void => void mocks.packageJsonPreparing.mockRejectedValue(new Error('offline')),
      ],
      ['Step: 6. Copying files', 'csr', (): void => void mocks.copyFiles.mockRejectedValue(new Error('ENOSPC'))],
      ['Step: 7. Creating files', 'csr', (): void => failWith(mocks.createFiles)],
      [
        'Step: 8. package.json updating',
        'csr',
        (): void => {
          mocks.writePackageJSON.mockImplementation((dir) =>
            dir === currentPath ? Promise.reject(new Error('EACCES')) : Promise.resolve(),
          );
        },
      ],
      [
        'Step: 9. Installing dependencies',
        'csr',
        (): void => void mocks.installDependencies.mockRejectedValue(new Error('npm ERR!')),
      ],
    ])('reports "%s"', async (step, appType, arrange) => {
      arrange();

      await expect(runInstall({ appType })).rejects.toBeInstanceOf(ShowErrorCalled);
      expect(reportedStep()).toBe(step);
    });

    it('stops the spinner before reporting a failed step', async () => {
      mocks.copyFiles.mockRejectedValue(new Error('ENOSPC'));

      await expect(runInstall()).rejects.toBeInstanceOf(ShowErrorCalled);
      expect(getSpinner().stop).toHaveBeenCalled();
    });

    it('returns before installing dependencies with --install=false', async () => {
      await runInstall({}, { noInstall: true });

      expect(mocks.writePackageJSON).toHaveBeenCalledWith(currentPath, { name: 'app', prepared: true });
      expect(mocks.installDependencies).not.toHaveBeenCalled();
      expect(getSpinner().stop).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('Project "app" was created successfully!');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('skips the git hooks but still writes .gitignore and .gitattributes when git is disabled', async () => {
      mocks.gitInit.mockImplementation((_path, state) => {
        state.nogit = true;
      });

      await runInstall();

      expect(mocks.writeFileSync).toHaveBeenCalledWith(path.join(currentPath, '.gitignore'), 'content');
      expect(mocks.writeFileSync).toHaveBeenCalledWith(path.join(currentPath, '.gitattributes'), 'content');
      expect(mocks.gitHooks).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalledWith('pre-commit, pre-push hooks added');
    });

    it('does not initialize git again when .git already exists', async () => {
      mocks.existsSync.mockImplementation((file) => file === path.join(currentPath, '.git'));

      await runInstall();

      expect(mocks.gitInit).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('GIT is already initialized');
    });
  });

  describe('positive cases', () => {
    it.each<AppType>(['csr', 'ssr'])('creates a %s application in order', async (appType) => {
      await runInstall({ appType });

      expect(callOrder()).toEqual([
        'wizard',
        'mkdirp',
        'existsSync',
        'gitInit',
        'mkdirSync',
        'readFileSync',
        'writeFileSync',
        'readFileSync',
        'writeFileSync',
        'createPackageJSON',
        'packageJsonPreparing',
        'copyFiles',
        'createFiles',
        'writePackageJSON',
        'installDependencies',
        'gitHooks',
      ]);
      expect(mocks.mkdirSync).not.toHaveBeenCalledWith(examplePath);
      expect(mocks.writeFileSync).toHaveBeenCalledWith(
        path.join(currentPath, '.gitignore'),
        appType === 'ssr' ? 'content\n# The frontend build of the ssr app\n/public\n' : 'content',
      );
      expect(mocks.writeFileSync).toHaveBeenCalledWith(path.join(currentPath, '.gitattributes'), 'content');
    });

    it.each<AppType>(['library', 'component'])('creates a %s with an example project', async (appType) => {
      await runInstall({ appType });

      expect(mocks.mkdirSync).toHaveBeenCalledWith(examplePath);
      expect(mocks.createPackageJSON).toHaveBeenCalledWith('app-example');
      expect(mocks.writePackageJSON).toHaveBeenCalledWith(examplePath, { name: 'app-example' });
      expect(mocks.writeFileSync).toHaveBeenCalledWith(path.join(currentPath, '.npmignore'), 'content');
      expect(mocks.installDependencies.mock.calls).toEqual([[currentPath], [examplePath]]);
    });

    it('installs a component and its example without a separate peer install', async () => {
      mocks.packageJsonPreparing.mockResolvedValue({ name: 'app', peerDependencies: { react: '19' } });

      await runInstall({ appType: 'component' });

      expect(mocks.installDependencies.mock.calls).toEqual([[currentPath], [examplePath]]);
    });

    it('passes offline mode to the next steps', async () => {
      await runInstall({}, { offline: true });

      expect(mocks.packageJsonPreparing).toHaveBeenCalledWith(
        { name: 'app' },
        expect.objectContaining({ offline: true }),
        currentPath,
      );
    });

    it('passes test mode and the project name to the next steps', async () => {
      await runInstall({}, { testMode: true });

      expect(mocks.packageJsonPreparing).toHaveBeenCalledWith(
        { name: 'app' },
        expect.objectContaining({ projectName: 'app', testMode: true }),
        currentPath,
      );
    });

    it('installs git hooks in the project directory', async () => {
      await runInstall({ tester: true });

      expect(mocks.gitHooks).toHaveBeenCalledWith(currentPath);
    });

    it('updates the spinner text while dependencies are installing', async () => {
      const texts: string[] = [];
      mocks.installDependencies.mockImplementation(() => {
        texts.push(getSpinner().text);
        [1, 2, 3].forEach(() => {
          jest.advanceTimersByTime(60 * 1000);
          texts.push(getSpinner().text);
        });

        return Promise.resolve();
      });

      await runInstall();

      expect(oraMock).toHaveBeenCalledWith('package.json is preparing. Dependencies are checking.\n');
      expect(texts).toEqual([
        'Project is initializing. It takes 2-5 minutes.',
        'Dependencies are installing. It takes 1-2 minutes.',
        'The developer dependencies are installing. Please wait.',
        'Almost everything is ready. Less than a minute remaining.',
      ]);
      expect(jest.getTimerCount()).toBe(0);
    });

    it('prints the application commands with tests and git', async () => {
      await runInstall({ appType: 'csr', tester: true });

      expect(logSpy).toHaveBeenCalledWith('npm start - run dev mode');
      expect(logSpy).toHaveBeenCalledWith('npm test - run tests');
      expect(logSpy).toHaveBeenCalledWith('pre-commit, pre-push hooks added');
      expect(logSpy).toHaveBeenLastCalledWith('Thank you for using Rockpack!');
    });

    it('prints the example commands for a library without tests', async () => {
      await runInstall({ appType: 'library', tester: false });

      expect(logSpy).toHaveBeenCalledWith('cd example && npm start - run dev mode');
      expect(logSpy).not.toHaveBeenCalledWith('npm test - run tests');
    });
  });
});
