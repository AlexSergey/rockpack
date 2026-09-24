import latestVersion from 'latest-version';
import childProcess from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks.js';

import { getPM } from './other.js';
import {
  addDependencies,
  addFields,
  addScripts,
  createPackageJSON,
  installDependencies,
  installDependency,
  installPeerDependencies,
  readPackageJSON,
  writePackageJSON,
} from './project.js';

jest.mock('latest-version', () => ({ __esModule: true, default: jest.fn() }));
jest.mock(
  'sort-package-json',
  () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').sortPackageJsonModule,
);
jest.mock('node:child_process', () => ({ exec: jest.fn() }));
jest.mock('./other.js', () => ({ getPM: jest.fn() }));

type ExecCallback = (error: Error | null) => void;

const latestVersionMock = latestVersion as jest.MockedFunction<typeof latestVersion>;
const execMock = childProcess.exec as unknown as jest.Mock<void, [string, { cwd: string }, ExecCallback]>;
const getPMMock = getPM as jest.MockedFunction<typeof getPM>;

const mockExecResult = (error: Error | null = null): void => {
  execMock.mockImplementation((_command, _options, callback) => {
    callback(error);
  });
};

describe('project utils', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-starter-'));
    getPMMock.mockReturnValue('npm');
    latestVersionMock.mockImplementation((name, options) => Promise.resolve(`${options?.version ?? ''}.9.9-${name}`));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('rejects reading a missing package.json', async () => {
      await expect(readPackageJSON(dir)).rejects.toMatchObject({ code: 'ENOENT' });
    });

    it('rejects reading an invalid package.json', async () => {
      writeFileSync(path.join(dir, 'package.json'), '{ "name": ');

      await expect(readPackageJSON(dir)).rejects.toThrow(SyntaxError);
    });

    it('rejects writing into a missing directory', async () => {
      await expect(writePackageJSON(path.join(dir, 'missing'), {})).rejects.toMatchObject({ code: 'ENOENT' });
    });

    it('surfaces an install error', async () => {
      const error = new Error('npm ERR!');
      mockExecResult(error);

      await expect(installDependencies(dir)).rejects.toBe(error);
    });

    it('surfaces a single dependency install error', async () => {
      const error = new Error('npm ERR!');
      mockExecResult(error);

      await expect(installDependency(dir, 'react@19')).rejects.toBe(error);
    });

    it('installs nothing when there are no peer dependencies', async () => {
      await installPeerDependencies({ name: 'app' }, dir);

      expect(execMock).not.toHaveBeenCalled();
    });

    it('does not mutate the source package.json when adding fields and scripts', () => {
      const source = { name: 'app', scripts: { test: 'jest' } };

      addFields(source, { main: 'index.js' });
      addScripts(source, { build: 'tsx build.ts' });

      expect(source).toEqual({ name: 'app', scripts: { test: 'jest' } });
    });
  });

  describe('positive cases', () => {
    it('reads and parses package.json', async () => {
      writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'app' }));

      await expect(readPackageJSON(dir)).resolves.toEqual({ name: 'app' });
    });

    it('writes package.json with two-space indentation and a trailing newline', async () => {
      await writePackageJSON(dir, { name: 'app', version: '1.0.0' });

      expect(readFileSync(path.join(dir, 'package.json'), 'utf8')).toBe(
        '{\n  "name": "app",\n  "version": "1.0.0"\n}\n',
      );
    });

    it('swaps the koa router and koa static types to match eslint-plugin-package-json', async () => {
      await writePackageJSON(dir, {
        // sort-package-json is mocked as identity, so this entry order stands for its output
        devDependencies: Object.fromEntries([
          ['@types/koa__router', '12'],
          ['@types/koa-static', '4'],
          ['typescript', '6'],
        ]),
      });

      const written = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) as {
        devDependencies: Record<string, string>;
      };

      expect(Object.keys(written.devDependencies)).toEqual(['@types/koa-static', '@types/koa__router', 'typescript']);
    });

    it('keeps the devDependencies order when only one koa types key exists', async () => {
      await writePackageJSON(dir, { devDependencies: { '@types/koa__router': '12', typescript: '6' } });

      const written = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) as {
        devDependencies: Record<string, string>;
      };

      expect(Object.keys(written.devDependencies)).toEqual(['@types/koa__router', 'typescript']);
    });

    it('resolves every dependency group through latest-version', async () => {
      const result = await addDependencies(
        { name: 'app' },
        {
          dependencies: [{ name: 'react', version: '19' }],
          devDependencies: [{ name: '@rockpack/compiler', version: '8.0.0' }],
          peerDependencies: [{ name: 'react-dom', version: '19' }],
        },
      );

      expect(result).toEqual({
        dependencies: { react: '19.9.9-react' },
        devDependencies: { '@rockpack/compiler': '8.0.0.9.9-@rockpack/compiler' },
        name: 'app',
        peerDependencies: { 'react-dom': '19.9.9-react-dom' },
      });
      expect(latestVersionMock).toHaveBeenCalledWith('react', { version: '19' });
    });

    it('pins @rockpack packages in test mode without asking the registry', async () => {
      const result = await addDependencies(
        {},
        {
          dependencies: [{ name: '@rockpack/utils', version: '8.0.0' }],
          devDependencies: [{ name: '@rockpack/tester', version: '8.0.0' }],
          peerDependencies: [{ name: '@rockpack/babel', version: '8.0.0' }],
        },
        { testMode: true },
      );

      expect(result).toEqual({
        dependencies: { '@rockpack/utils': '8.0.0' },
        devDependencies: { '@rockpack/tester': '8.0.0' },
        peerDependencies: { '@rockpack/babel': '8.0.0' },
      });
      expect(latestVersionMock).not.toHaveBeenCalled();
    });

    it('still resolves third-party packages in test mode', async () => {
      const result = await addDependencies(
        {},
        { devDependencies: [{ name: 'typescript', version: '6' }] },
        { testMode: true },
      );

      expect(result).toEqual({ devDependencies: { typescript: '6.9.9-typescript' } });
    });

    it('writes the versions.json ranges without the registry when offline', async () => {
      const result = await addDependencies(
        {},
        {
          dependencies: [{ name: 'react', version: '19' }],
          devDependencies: [{ name: '@rockpack/tester', version: '8.0.0' }],
        },
        { offline: true },
      );

      expect(result).toEqual({ dependencies: { react: '19' }, devDependencies: { '@rockpack/tester': '8.0.0' } });
      expect(latestVersionMock).not.toHaveBeenCalled();
    });

    it('drops empty dependency groups and keeps existing entries', async () => {
      const result = await addDependencies(
        { devDependencies: { eslint: '10.0.0' } },
        { devDependencies: [{ name: 'typescript', version: '6' }] },
      );

      expect(result).toEqual({ devDependencies: { eslint: '10.0.0', typescript: '6.9.9-typescript' } });
    });

    it('merges fields and scripts', () => {
      const withFields = addFields({ name: 'app', scripts: { test: 'jest' } }, { main: 'index.js' });

      expect(addScripts(withFields, { build: 'tsx build.ts' })).toEqual({
        main: 'index.js',
        name: 'app',
        scripts: { build: 'tsx build.ts', test: 'jest' },
      });
    });

    it('creates the initial package.json for a project', () => {
      expect(createPackageJSON('my-app')).toEqual({
        author: 'email@email.com',
        description: '<description>',
        keywords: ['my-app'],
        license: 'ISC',
        main: 'index.js',
        name: 'my-app',
        scripts: { test: 'echo "Error: no test specified" && exit 1' },
        version: '1.0.0',
      });
    });

    it('installs dependencies with npm', async () => {
      mockExecResult();

      await installDependencies(dir);

      expect(execMock).toHaveBeenCalledWith('npm install -q', { cwd: dir }, expect.any(Function));
    });

    it('installs dependencies with yarn', async () => {
      getPMMock.mockReturnValue('yarn');
      mockExecResult();

      await installDependencies(dir);

      expect(execMock).toHaveBeenCalledWith('yarn install -q', { cwd: dir }, expect.any(Function));
    });

    it('installs peer dependencies one by one', async () => {
      mockExecResult();

      await installPeerDependencies({ peerDependencies: { react: '19', 'react-dom': '19' } }, dir);

      expect(execMock.mock.calls.map(([command]) => command)).toEqual([
        'npm install react@19 -q',
        'npm install react-dom@19 -q',
      ]);
    });
  });
});
