import path from 'node:path';
import { getPM } from '../utils/other.js';
import { packageJson } from '../utils/package-json.js';
import { addFields, addScripts, addDependencies, readPackageJSON, writePackageJSON } from '../utils/project.js';

export const packageJSONPreparing = async (packageJSON, { appType, tester, nogit }, currentPath) => {
  switch (appType) {
    case 'csr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'axios', version: '1' },
          { name: 'react', version: '19' },
          { name: 'react-dom', version: '19' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: packageJson.version },
          { name: '@types/node', version: '22' },
          { name: '@types/react', version: '19' },
          { name: '@types/react-dom', version: '19' },
        ],
      });
      break;

    case 'ssr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'axios', version: '1' },
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: 'react', version: '19' },
          { name: 'react-dom', version: '19' },
          { name: 'react-router-dom', version: '7' },
          { name: '@issr/core', version: '3' },
          { name: 'serialize-javascript', version: '6' },
          { name: '@koa/router', version: '13' },
        ],
        devDependencies: [
          { name: '@issr/babel-plugin', version: '3' },
          { name: '@rockpack/compiler', version: packageJson.version },
          { name: '@types/react', version: '19' },
          { name: '@types/react-dom', version: '19' },
          { name: '@types/koa', version: '2' },
          { name: '@types/koa__router', version: '12' },
          { name: '@types/koa-static', version: '4' },
          { name: '@types/node', version: '22' },
          { name: '@types/serialize-javascript', version: '5' },
        ],
      });
      break;

    case 'library':
    case 'component':
      if (appType === 'component') {
        packageJSON = await addDependencies(packageJSON, {
          peerDependencies: [
            { name: 'react', version: '19' },
            { name: 'react-dom', version: '19' },
          ],
          devDependencies: [
            { name: '@types/react', version: '19' },
            { name: '@types/react-dom', version: '19' },
          ],
        });
      }

      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [{ name: '@rockpack/compiler', version: packageJson.version }],
      });
      if (appType === 'component') {
        packageJSON = addFields(packageJSON, {
          main: 'dist/index.js',
          types: 'dist/index.d.ts',
        });
      } else if (appType === 'library') {
        packageJSON = addFields(packageJSON, {
          exports: {
            '.': {
              import: './lib/esm/index.mjs',
              require: './lib/cjs/index.cjs',
            },
          },
          main: './lib/cjs/index.cjs',
          module: './lib/esm/index.mjs',
          types: './dist/types/index.d.ts',
        });
      }

      const production = `${getPM()} run lint && ${
        tester ? `${getPM()} test && ` : ''
      }${getPM()} run build && ${getPM()} publish`;

      packageJSON = addScripts(packageJSON, {
        production,
      });
      break;
  }

  packageJSON = await addDependencies(packageJSON, {
    devDependencies: [{ name: '@rockpack/tsconfig', version: packageJson.version }],
  });

  if (appType === 'library' || appType === 'component') {
    packageJSON = addScripts(packageJSON, {
      analyzer: 'node scripts.build --analyzer',
      build: 'node scripts.build --mode=production',
      'build:example': 'node example/scripts.build --mode=production',
      start: 'node example/scripts.build',
    });

    const examplePath = path.resolve(currentPath, 'example');
    let packageJSONExample = await readPackageJSON(examplePath);

    if (appType === 'component') {
      packageJSONExample = await addDependencies(packageJSONExample, {
        dependencies: [
          { name: 'react', version: '19' },
          { name: 'react-dom', version: '19' },
        ],
      });
    }

    await writePackageJSON(examplePath, packageJSONExample);
  } else {
    packageJSON = addScripts(packageJSON, {
      analyzer: 'node scripts.build --analyzer',
      build: 'node scripts.build --mode=production',
      start: 'node scripts.build',
    });
  }

  packageJSON = addScripts(packageJSON, {
    format:
      appType === 'library'
        ? 'npm run format:package && npm run format:prettier && npm run format:code'
        : 'npm run format:package && npm run format:prettier && npm run format:code && npm run format:styles',
    'format:code': 'eslint . --fix',
    'format:package': 'sort-package-json',
    'format:prettier': 'prettier --write "src/**/*.{ts,tsx,json}"',
    'format:styles': 'stylelint "src/**/*.scss" --fix',
    lint:
      appType === 'library'
        ? 'npm run lint:ts && npm run lint:code'
        : 'npm run lint:ts && npm run lint:code && npm run lint:styles',
    'lint:code': 'eslint .',
    'lint:commit': 'commitlint -e',
    'lint:ts': 'tsc --noEmit',
    'lint:styles': 'stylelint "src/**/*.scss"',
  });
  packageJSON = await addDependencies(packageJSON, {
    devDependencies: [{ name: '@rockpack/codestyle', version: packageJson.version }],
  });

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: 'node scripts.tests.js',
      'test:watch': 'node scripts.tests.js --watch',
    });

    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: '@rockpack/tester', version: packageJson.version },
        { name: '@types/jest', version: '29' },
        { name: 'source-map', version: '0.8.0-beta.0' },
      ],
    });

    if (appType === 'csr' || appType === 'ssr') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [{ name: 'axios-mock-adapter', version: '2' }],
      });
    }

    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@testing-library/jest-dom', version: '6' },
          { name: '@testing-library/react', version: '16' },
          { name: '@testing-library/jest-dom', version: '6' },
          { name: 'jest-environment-jsdom', version: '29' },
        ],
      });
    }
  }

  if (!nogit) {
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: 'husky', version: '9' },
        { name: 'lint-staged', version: '15' },
      ],
    });

    packageJSON = addScripts(packageJSON, {
      'pre-commit': 'lint-staged',
    });
  }

  return packageJSON;
};
