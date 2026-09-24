import { readFileSync } from 'node:fs';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks';
import type { DependencyGroups, PackageJsonObject } from '../types/package';
import type { Versions } from '../types/versions';
import type * as ProjectModule from '../utils/project';
import type { State } from './wizard';

import { packageJson } from '../utils/package-json';
import { addDependencies, readPackageJSON, writePackageJSON } from '../utils/project';
import { packageJsonPreparing } from './package-json-preparing';

jest.mock('latest-version', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('sort-package-json', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks').sortPackageJsonModule);
jest.mock('../utils/other', () => ({ getPM: (): string => 'npm' }));
jest.mock('../utils/project', () => ({
  ...jest.requireActual<typeof ProjectModule>('../utils/project'),
  addDependencies: jest.fn(),
  readPackageJSON: jest.fn(),
  writePackageJSON: jest.fn(),
}));

const addDependenciesMock = addDependencies as jest.MockedFunction<typeof addDependencies>;
const readPackageJSONMock = readPackageJSON as jest.MockedFunction<typeof readPackageJSON>;
const writePackageJSONMock = writePackageJSON as jest.MockedFunction<typeof writePackageJSON>;

const versions = JSON.parse(readFileSync(path.resolve(__dirname, '../versions.json'), 'utf8')) as Versions;
const { version } = packageJson;
const currentPath = '/work/app';

const prepare = (state: Pick<State, 'appType' | 'nogit' | 'tester' | 'testMode'>): Promise<PackageJsonObject> =>
  packageJsonPreparing({ name: 'app' }, state, currentPath);

const addedGroups = (): DependencyGroups[] => addDependenciesMock.mock.calls.map(([, groups]) => groups);

const getScripts = (packageJSON: PackageJsonObject): Record<string, string> =>
  packageJSON['scripts'] as Record<string, string>;

const codestyleGroup: DependencyGroups = { devDependencies: [{ name: '@rockpack/codestyle', version }] };
const compilerAndTsconfig = [
  { name: '@rockpack/compiler', version },
  { name: '@rockpack/tsconfig', version },
];

describe('packageJsonPreparing', () => {
  beforeEach(() => {
    addDependenciesMock.mockImplementation((packageJSON) => Promise.resolve(packageJSON));
    readPackageJSONMock.mockResolvedValue({ name: 'app-example' });
    writePackageJSONMock.mockResolvedValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('adds only the lint setup for an unknown project type without tests and git', async () => {
      const result = await prepare({ appType: undefined, nogit: true, tester: false });

      expect(Object.keys(getScripts(result)).sort()).toEqual([
        'format',
        'format:code',
        'format:prettier',
        'format:styles',
        'lint',
        'lint:code',
        'lint:commit',
        'lint:styles',
        'lint:ts',
      ]);
      expect(addedGroups()).toEqual([codestyleGroup]);
      expect(writePackageJSONMock).not.toHaveBeenCalled();
    });

    it('adds no test scripts or tester dependencies without tests', async () => {
      const result = await prepare({ appType: 'csr', nogit: true, tester: false });

      expect(getScripts(result)).not.toHaveProperty('test');
      expect(addedGroups()).toHaveLength(2);
    });

    it('adds no pre-commit script or git dependencies when git is disabled', async () => {
      const result = await prepare({ appType: 'csr', nogit: true, tester: false });

      expect(getScripts(result)).not.toHaveProperty('pre-commit');
      expect(addedGroups()).not.toContainEqual(versions.git.common);
    });
  });

  describe('positive cases', () => {
    it('prepares a csr application', async () => {
      const result = await prepare({ appType: 'csr', nogit: true, tester: false, testMode: true });

      expect(getScripts(result)).toMatchObject({
        analyzer: 'tsx scripts.build.ts --analyzer',
        build: 'tsx scripts.build.ts --mode=production',
        lint: 'npm run lint:ts && npm run lint:code && npm run lint:styles',
        start: 'tsx scripts.build.ts',
      });
      expect(addDependenciesMock.mock.calls[0]).toEqual([
        expect.anything(),
        {
          dependencies: versions.csr.common.dependencies,
          devDependencies: [...(versions.csr.common.devDependencies ?? []), ...compilerAndTsconfig],
        },
        true,
      ]);
    });

    it('prepares an ssr application with @rockpack/babel', async () => {
      await prepare({ appType: 'ssr', nogit: true, tester: false });

      expect(addedGroups()[0]).toEqual({
        dependencies: versions.ssr.common.dependencies,
        devDependencies: [
          { name: '@rockpack/babel', version },
          ...(versions.ssr.common.devDependencies ?? []),
          ...compilerAndTsconfig,
        ],
      });
    });

    it('prepares a library with package exports and an example project', async () => {
      const result = await prepare({ appType: 'library', nogit: true, tester: false });

      expect(result).toMatchObject({
        exports: {
          '.': {
            import: './lib/esm/index.mjs',
            require: './lib/cjs/index.cjs',
            types: './dist/types/index.d.ts',
          },
        },
        main: './lib/cjs/index.cjs',
        module: './lib/esm/index.mjs',
        types: './dist/types/index.d.ts',
      });
      expect(getScripts(result)).toMatchObject({
        'build:example': 'node example/scripts.build.ts --mode=production',
        format: 'npm run format:prettier && npm run format:code',
        lint: 'npm run lint:ts && npm run lint:code',
        production: 'npm run lint && npm run build && npm publish',
      });
      expect(addedGroups().slice(0, 2)).toEqual([versions.library.common, { devDependencies: compilerAndTsconfig }]);
      expect(readPackageJSONMock).toHaveBeenCalledWith(path.resolve(currentPath, 'example'));
      expect(writePackageJSONMock).toHaveBeenCalledWith(path.resolve(currentPath, 'example'), { name: 'app-example' });
    });

    it('prepares a component whose example depends on the peer dependencies', async () => {
      const result = await prepare({ appType: 'component', nogit: true, tester: true });

      expect(result).toMatchObject({ main: 'dist/index.js', types: 'dist/index.d.ts' });
      expect(getScripts(result)['production']).toBe('npm run lint && npm test && npm run build && npm publish');
      expect(addedGroups().slice(0, 3)).toEqual([
        versions.component.common,
        { devDependencies: compilerAndTsconfig },
        { dependencies: versions.component.common.peerDependencies },
      ]);
      expect(addDependenciesMock.mock.calls[2]?.[0]).toEqual({ name: 'app-example' });
    });

    it.each(['csr', 'ssr', 'component'] as const)(
      'adds tester and react testing dependencies for %s',
      async (appType) => {
        const result = await prepare({ appType, nogit: true, tester: true });

        expect(getScripts(result)).toMatchObject({
          test: 'tsx scripts.tests.ts',
          'test:watch': 'tsx scripts.tests.ts --watch',
        });
        expect(addedGroups().slice(-2)).toEqual([
          {
            devDependencies: [{ name: '@rockpack/tester', version }, ...(versions.tester.common.devDependencies ?? [])],
          },
          versions.tester.react,
        ]);
      },
    );

    it('adds tester without react testing dependencies for a library', async () => {
      await prepare({ appType: 'library', nogit: true, tester: true });

      expect(addedGroups()).not.toContainEqual(versions.tester.react);
      expect(addedGroups()[addedGroups().length - 1]).toEqual({
        devDependencies: [{ name: '@rockpack/tester', version }, ...(versions.tester.common.devDependencies ?? [])],
      });
    });

    it('adds git dependencies and the pre-commit script when git is enabled', async () => {
      const result = await prepare({ appType: 'csr', tester: false });

      expect(getScripts(result)['pre-commit']).toBe('lint-staged --config .lintstagedrc.cjs');
      expect(addedGroups()[addedGroups().length - 1]).toEqual(versions.git.common);
    });
  });
});
