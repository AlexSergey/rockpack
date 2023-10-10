import path from 'node:path';
import { getPM } from '../utils/other.js';
import { packageJson } from '../utils/package-json.js';
import { addFields, addScripts, addDependencies, readPackageJSON, writePackageJSON } from '../utils/project.js';

export const packageJSONPreparing = async (packageJSON, { appType, tester, codestyle, nogit }, currentPath) => {
  switch (appType) {
    case 'csr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '18' },
          { name: 'redux-thunk', version: '2' },
          { name: 'history', version: '5' },
          { name: 'react-dom', version: '18' },
          { name: 'react-redux', version: '8' },
          { name: 'react-router', version: '6' },
          { name: 'react-router-dom', version: '6' },
          { name: 'history', version: '5' },
          { name: 'react-helmet', version: '6' },
          { name: 'redux', version: '4' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: '@loadable/component', version: '5' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: packageJson.version },
          { name: '@types/react', version: '18' },
          { name: '@types/react-dom', version: '18' },
          { name: '@types/react-helmet', version: '6' },
          { name: '@types/loadable__component', version: '5' },
          { name: '@types/node', version: '16' },
          { name: '@types/webpack-env', version: '1.16.2' },
        ],
      });
      break;

    case 'ssr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'koa', version: '2' },
          { name: 'koa-compress', version: '5' },
          { name: 'redux-thunk', version: '2' },
          { name: 'history', version: '5' },
          { name: 'koa-static', version: '5' },
          { name: 'react', version: '18' },
          { name: 'react-dom', version: '18' },
          { name: 'react-redux', version: '8' },
          { name: 'react-router', version: '6' },
          { name: 'react-router-dom', version: '6' },
          { name: 'redux', version: '4' },
          { name: 'react-helmet-async', version: '1' },
          { name: '@issr/core', version: '2.2.0' },
          { name: 'node-fetch', version: '3' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: 'serialize-javascript', version: '5' },
          { name: 'entities', version: '2' },
          { name: 'pretty-error', version: '4' },
          { name: '@koa/router', version: '8' },
          { name: '@loadable/component', version: '5' },
          { name: '@loadable/server', version: '5' },
        ],
        devDependencies: [
          { name: '@issr/babel-plugin', version: '2.2.0' },
          { name: '@rockpack/compiler', version: packageJson.version },
          { name: '@types/react', version: '18' },
          { name: '@types/react-dom', version: '18' },
          { name: '@types/loadable__component', version: '5' },
          { name: '@types/koa', version: '2' },
          { name: '@types/koa-compress', version: '4' },
          { name: '@types/koa__router', version: '8' },
          { name: '@types/koa-static', version: '4' },
          { name: '@types/loadable__server', version: '5' },
          { name: '@types/node', version: '16' },
          { name: '@types/serialize-javascript', version: '5' },
        ],
      });
      break;

    case 'library':
    case 'component':
      if (appType === 'component') {
        packageJSON = await addDependencies(packageJSON, {
          peerDependencies: [
            { name: 'react', version: '18' },
            { name: 'react-dom', version: '18' },
          ],
          devDependencies: [
            { name: '@types/react', version: '18' },
            { name: '@types/react-dom', version: '18' },
          ],
        });
      }

      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [{ name: '@rockpack/compiler', version: packageJson.version }],
      });

      packageJSON = addFields(packageJSON, {
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
      });

      const production = `${codestyle ? `${getPM()} run lint && ` : ''}${
        tester ? `${getPM()} test && ` : ''
      }${getPM()} run build && ${getPM()} publish`;

      packageJSON = addScripts(packageJSON, {
        production,
      });
      break;

    case 'nodejs':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: packageJson.version },
          { name: '@types/node', version: '16' },
        ],
      });
      break;
  }

  packageJSON = await addDependencies(packageJSON, {
    devDependencies: [
      { name: '@rockpack/tsconfig', version: packageJson.version },
    ],
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
          { name: 'react', version: '18' },
          { name: 'react-dom', version: '18' },
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

  if (codestyle) {
    packageJSON = addScripts(packageJSON, {
      format: appType === 'library' ?
        'npm run format:package && npm run format:prettier && npm run format:code' :
        'npm run format:package && npm run format:prettier && npm run format:code && npm run format:styles',
      'format:code': 'eslint --ext .ts,.tsx,.json src/ --fix',
      'format:package': 'sort-package-json',
      'format:prettier': 'prettier --write "src/**/*.{ts,tsx,json}"',
      'format:styles': 'stylelint "src/**/*.scss" --fix',
      lint: appType === 'library' ?
        'npm run lint:ts && npm run lint:code' :
        'npm run lint:ts && npm run lint:code && npm run lint:styles',
      'lint:code': 'eslint --ext .ts,.tsx,.json src/',
      'lint:commit': 'commitlint -e',
      'lint:ts': 'tsc --noEmit',
      'lint:styles': 'stylelint "src/**/*.scss"',
    });
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [{ name: '@rockpack/codestyle', version: packageJson.version }],
    });
  }

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: 'node scripts.tests.js',
      'test:watch': 'node scripts.tests.js --watch',
    });

    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [{ name: '@rockpack/tester', version: packageJson.version }],
    });

    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: 'react-test-renderer', version: '18' },
          { name: '@testing-library/jest-dom', version: '5' },
          { name: '@testing-library/react', version: '13' },
          { name: '@types/react-test-renderer', version: '18' },
        ],
      });
    }
  }

  if (!nogit) {
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: 'husky', version: '8.0.1' },
        { name: 'lint-staged', version: '13' }
      ],
    });

    if (codestyle) {
      packageJSON = addScripts(packageJSON, {
        'pre-commit': 'lint-staged'
      });
    }
  }

  return packageJSON;
};
