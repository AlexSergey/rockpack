import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PackageJsonObject } from '../types/package.js';
import type { Versions } from '../types/versions.js';
import type { State } from './wizard.js';

import { getPM } from '../utils/other.js';
import { packageJson } from '../utils/package-json.js';
import { addDependencies, addFields, addScripts, readPackageJSON, writePackageJSON } from '../utils/project.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

export const packageJsonPreparing = async (
  packageJSON: PackageJsonObject,
  { appType, nogit, offline, tester, testMode }: Pick<State, 'appType' | 'nogit' | 'offline' | 'tester' | 'testMode'>,
  currentPath: string,
  // eslint-disable-next-line @sonar/cognitive-complexity
): Promise<PackageJsonObject> => {
  const resolution = { offline: offline === true, testMode: testMode === true };
  const versions = readFileSync(join(currentDir, '../versions.json'), 'utf8');
  const typedVersions: Versions = JSON.parse(versions) as Versions;

  switch (appType) {
    case 'component':
    case 'library':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'tsx scripts.build.ts --analyzer',
        build: 'tsx scripts.build.ts --mode=production',
        'build:example': 'node example/scripts.build.ts --mode=production',
        start: 'node example/scripts.build.ts',
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
      break;

    case 'csr':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'tsx scripts.build.ts --analyzer',
        build: 'tsx scripts.build.ts --mode=production',
        start: 'tsx scripts.build.ts',
      });

      const csrDeps = typedVersions.csr.common.dependencies;
      const csrDevDeps = typedVersions.csr.common.devDependencies;
      packageJSON = await addDependencies(
        packageJSON,
        {
          dependencies: Array.isArray(csrDeps) ? csrDeps : [],
          devDependencies: [
            ...(Array.isArray(csrDevDeps) ? csrDevDeps : []),
            {
              name: '@rockpack/compiler',
              version: packageJson.version,
            },
            { name: '@rockpack/tsconfig', version: packageJson.version },
          ],
        },
        resolution,
      );
      break;

    case 'ssr':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'tsx scripts.build.ts --analyzer',
        build: 'tsx scripts.build.ts --mode=production',
        start: 'tsx scripts.build.ts',
      });

      const ssrDeps = typedVersions.ssr.common.dependencies;
      const ssrDevDeps = typedVersions.ssr.common.devDependencies;
      packageJSON = await addDependencies(
        packageJSON,
        {
          dependencies: Array.isArray(ssrDeps) ? ssrDeps : [],
          devDependencies: [
            { name: '@rockpack/babel', version: packageJson.version },
            ...(Array.isArray(ssrDevDeps) ? ssrDevDeps : []),
            {
              name: '@rockpack/compiler',
              version: packageJson.version,
            },
            { name: '@rockpack/tsconfig', version: packageJson.version },
          ],
        },
        resolution,
      );
      break;
  }

  packageJSON = addScripts(packageJSON, {
    format:
      appType === 'library'
        ? 'npm run format:prettier && npm run format:code'
        : 'npm run format:prettier && npm run format:code && npm run format:styles',
    'format:code': 'eslint . --fix',
    'format:prettier': 'prettier --write "src/**/*.{ts,tsx,json}"',
    'format:styles': 'stylelint "src/**/*.{css,scss}" --fix',
    lint:
      appType === 'library'
        ? 'npm run lint:ts && npm run lint:code'
        : 'npm run lint:ts && npm run lint:code && npm run lint:styles',
    'lint:code': 'eslint .',
    'lint:commit': 'commitlint --config .commitlintrc.cjs --edit',
    'lint:styles': 'stylelint --config .stylelintrc.cjs "src/**/*.{css,scss}"',
    'lint:ts': 'tsc --noEmit',
  });

  packageJSON = await addDependencies(
    packageJSON,
    {
      devDependencies: [{ name: '@rockpack/codestyle', version: packageJson.version }],
    },
    resolution,
  );

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: 'tsx scripts.tests.ts',
      'test:watch': 'tsx scripts.tests.ts --watch',
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
  }

  if (!nogit) {
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
  }

  return packageJSON;
};
