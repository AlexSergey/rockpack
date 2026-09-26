import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PackageJsonObject } from '../types/package.js';
import type { Versions } from '../types/versions.js';
import type { State } from './wizard.js';

import { getPM } from '../utils/other.js';
import { packageJson } from '../utils/package-json.js';
import { addDependencies, addFields, addScripts, readPackageJSON, writePackageJSON } from '../utils/project.js';
import { makeKnipConfig } from './knip-config.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

// Node.js runs the TypeScript build and test scripts itself; `.mts` makes them ES modules without a "type" in
// package.json (the ssr server and the published bundles are CommonJS).
const RUN_TS = 'node';

type PrepareState = Pick<State, 'appType' | 'nogit' | 'offline' | 'tester' | 'testMode'>;

type Resolution = Parameters<typeof addDependencies>[2];

const readVersions = (): Versions => JSON.parse(readFileSync(join(currentDir, '../versions.json'), 'utf8')) as Versions;

// A component or a library: the package fields, the publish script and the example project.
const preparePublished = async (
  packageJSON: PackageJsonObject,
  { appType, tester }: PrepareState,
  currentPath: string,
  typedVersions: Versions,
  resolution: Resolution,
): Promise<PackageJsonObject> => {
  packageJSON = addScripts(packageJSON, {
    build: `${RUN_TS} scripts.build.mts --mode=production`,
    'build:example': `${RUN_TS} example/scripts.build.mts --mode=production`,
    start: `${RUN_TS} example/scripts.build.mts`,
  });

  if (appType === 'library') {
    const libDeps = typedVersions.library.common;

    packageJSON = await addDependencies(packageJSON, libDeps, resolution);
  }

  if (appType === 'component') {
    const compDeps = typedVersions.component.common;

    packageJSON = await addDependencies(packageJSON, compDeps, resolution);
    packageJSON = addFields(packageJSON, {
      files: ['dist'],
      main: 'dist/index.js',
      types: 'dist/types/index.d.ts',
    });
  }

  packageJSON = await addDependencies(
    packageJSON,
    {
      devDependencies: [
        { name: '@rockpack/compiler', version: packageJson.version },
        { name: '@rockpack/tsconfig', version: packageJson.version },
      ],
    },
    resolution,
  );

  if (appType === 'library') {
    packageJSON = addFields(packageJSON, {
      exports: {
        '.': {
          import: './lib/esm/index.mjs',
          require: './lib/cjs/index.cjs',
          types: './dist/types/index.d.ts',
        },
      },
      files: ['dist', 'lib'],
      main: './lib/cjs/index.cjs',
      module: './lib/esm/index.mjs',
      types: './dist/types/index.d.ts',
    });
  }

  {
    const production = `${getPM()} run lint && ${
      tester ? `${getPM()} test && ` : ''
    }${getPM()} run build && ${getPM()} publish`;

    packageJSON = addScripts(packageJSON, { production });
  }

  const examplePath = resolve(currentPath, 'example');
  let packageJSONExample = await readPackageJSON(examplePath);

  if (appType === 'component') {
    const deps = typedVersions.component.common.peerDependencies;

    packageJSONExample = await addDependencies(
      packageJSONExample,
      {
        dependencies: Array.isArray(deps) ? deps : [],
      },
      resolution,
    );
  }

  await writePackageJSON(examplePath, packageJSONExample);

  return packageJSON;
};

const prepareApp = async (
  packageJSON: PackageJsonObject,
  appType: 'csr' | 'ssr',
  typedVersions: Versions,
  resolution: Resolution,
): Promise<PackageJsonObject> => {
  packageJSON = addScripts(packageJSON, {
    build: `${RUN_TS} scripts.build.mts --mode=production`,
    start: `${RUN_TS} scripts.build.mts`,
  });

  const deps = typedVersions[appType].common.dependencies;
  const devDeps = typedVersions[appType].common.devDependencies;

  return addDependencies(
    packageJSON,
    {
      dependencies: Array.isArray(deps) ? deps : [],
      devDependencies: [
        // The ssr template configures Babel for the server bundle.
        ...(appType === 'ssr' ? [{ name: '@rockpack/babel', version: packageJson.version }] : []),
        ...(Array.isArray(devDeps) ? devDeps : []),
        {
          name: '@rockpack/compiler',
          version: packageJson.version,
        },
        { name: '@rockpack/tsconfig', version: packageJson.version },
      ],
    },
    resolution,
  );
};

const addTester = async (
  packageJSON: PackageJsonObject,
  { appType }: PrepareState,
  typedVersions: Versions,
  resolution: Resolution,
): Promise<PackageJsonObject> => {
  packageJSON = addScripts(packageJSON, {
    test: `${RUN_TS} scripts.tests.mts`,
    'test:watch': `${RUN_TS} scripts.tests.mts --watch`,
  });
  const testerCommonDeps = typedVersions.tester.common.devDependencies;
  packageJSON = await addDependencies(
    packageJSON,
    {
      devDependencies: [
        { name: '@rockpack/tester', version: packageJson.version },
        ...(Array.isArray(testerCommonDeps) ? testerCommonDeps : []),
      ],
    },
    resolution,
  );

  if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
    const testerReactDeps = typedVersions.tester.react;
    packageJSON = await addDependencies(packageJSON, testerReactDeps, resolution);
  }

  return packageJSON;
};

const addGit = async (
  packageJSON: PackageJsonObject,
  { tester }: PrepareState,
  typedVersions: Versions,
  resolution: Resolution,
): Promise<PackageJsonObject> => {
  const gitDeps = typedVersions.git.common;
  packageJSON = await addDependencies(packageJSON, gitDeps, resolution);

  packageJSON = addScripts(packageJSON, {
    'pre-commit': 'lint-staged --config .lintstagedrc.cjs',
    prepare: 'simple-git-hooks',
  });
  packageJSON = addFields(packageJSON, {
    'simple-git-hooks': {
      'commit-msg': `${getPM()} run lint:commit`,
      'pre-commit': `${getPM()} run pre-commit`,
      ...(tester ? { 'pre-push': `${getPM()} test` } : {}),
    },
  });

  return packageJSON;
};

export const packageJsonPreparing = async (
  packageJSON: PackageJsonObject,
  state: PrepareState,
  currentPath: string,
): Promise<PackageJsonObject> => {
  const { appType, nogit, offline, tester, testMode } = state;
  const resolution = { offline: offline === true, testMode: testMode === true };
  const typedVersions = readVersions();

  if (appType === 'component' || appType === 'library') {
    packageJSON = await preparePublished(packageJSON, state, currentPath, typedVersions, resolution);
  } else if (appType === 'csr' || appType === 'ssr') {
    packageJSON = await prepareApp(packageJSON, appType, typedVersions, resolution);
  }

  // Libraries ship no styles, so they get no style scripts.
  const styleScripts =
    appType === 'library'
      ? {}
      : {
          'format:styles': 'stylelint "src/**/*.{css,scss}" --fix',
          'lint:styles': 'stylelint --config .stylelintrc.cjs "src/**/*.{css,scss}"',
        };

  const pm = getPM();

  packageJSON = addScripts(packageJSON, {
    format:
      appType === 'library'
        ? `${pm} run format:prettier && ${pm} run format:code`
        : `${pm} run format:prettier && ${pm} run format:code && ${pm} run format:styles`,
    'format:code': 'eslint . --fix',
    'format:prettier': 'prettier --write "src/**/*.{ts,tsx,json}"',
    lint:
      appType === 'library'
        ? `${pm} run lint:ts && ${pm} run lint:code && ${pm} run lint:deps`
        : `${pm} run lint:ts && ${pm} run lint:code && ${pm} run lint:styles && ${pm} run lint:deps`,
    'lint:code': 'eslint .',
    'lint:commit': 'commitlint --config .commitlintrc.cjs --edit',
    'lint:deps': 'knip',
    'lint:ts': 'tsc --noEmit',
    ...styleScripts,
  });

  packageJSON = await addDependencies(
    packageJSON,
    {
      devDependencies: [
        { name: '@rockpack/codestyle', version: packageJson.version },
        ...(typedVersions.codestyle.common.devDependencies ?? []),
      ],
    },
    resolution,
  );

  if (appType) {
    packageJSON = addFields(packageJSON, {
      knip: makeKnipConfig({ appType, tester: tester === true }),
    });
  }

  if (tester) {
    packageJSON = await addTester(packageJSON, state, typedVersions, resolution);
  }

  if (!nogit) {
    packageJSON = await addGit(packageJSON, state, typedVersions, resolution);
  }

  return packageJSON;
};
