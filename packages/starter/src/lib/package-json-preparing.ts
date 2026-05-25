import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PackageJsonObject } from '../types/package';
import type { Versions } from '../types/versions';
import type { State } from './wizard';

import { getPM } from '../utils/other';
import { packageJson } from '../utils/package-json';
import { addDependencies, addFields, addScripts, readPackageJSON, writePackageJSON } from '../utils/project';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const packageJsonPreparing = async (
  packageJSON: PackageJsonObject,
  { appType, nogit, tester, testMode }: Pick<State, 'appType' | 'nogit' | 'tester' | 'testMode'>,
  currentPath: string,
  // eslint-disable-next-line @sonar/cognitive-complexity
): Promise<PackageJsonObject> => {
  const versions = readFileSync(join(__dirname, '../versions.json'), 'utf8');
  const typedVersions: Versions = JSON.parse(versions) as Versions;

  switch (appType) {
    case 'component':
    case 'library':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'node scripts.build.js --analyzer',
        build: 'node scripts.build.js --mode=production',
        'build:example': 'node example/scripts.build.js --mode=production',
        start: 'node example/scripts.build.js',
      });

      if (appType === 'component') {
        const compDeps = typedVersions.component.common;

        packageJSON = await addDependencies(packageJSON, compDeps, testMode);
        packageJSON = addFields(packageJSON, {
          main: 'dist/index.js',
          types: 'dist/index.d.ts',
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
        testMode,
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
          { dependencies: Array.isArray(deps) ? deps : [] },
          testMode,
        );
      }

      await writePackageJSON(examplePath, packageJSONExample);
      break;

    case 'csr':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'node scripts.build.js --analyzer',
        build: 'node scripts.build.js --mode=production',
        start: 'node scripts.build.js',
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
        testMode,
      );
      break;

    case 'ssr':
      packageJSON = addScripts(packageJSON, {
        analyzer: 'node scripts.build.js --analyzer',
        build: 'node scripts.build.js --mode=production',
        start: 'node scripts.build.js',
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
        testMode,
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
    testMode,
  );

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: 'node scripts.tests.js',
      'test:watch': 'node scripts.tests.js --watch',
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
      testMode,
    );

    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      const testerReactDeps = typedVersions.tester.react;
      packageJSON = await addDependencies(packageJSON, testerReactDeps, testMode);
    }
  }

  if (!nogit) {
    const gitDeps = typedVersions.git.common;
    packageJSON = await addDependencies(packageJSON, gitDeps, testMode);

    packageJSON = addScripts(packageJSON, {
      'pre-commit': 'lint-staged --config .lintstagedrc.cjs',
    });
  }

  return packageJSON;
};
