const path = require('path');
const {
  addFields,
  addScripts,
  addDependencies,
  readPackageJSON,
  writePackageJSON
} = require('../utils/project');
const {
  getPM
} = require('../utils/other');

const packageJSONPreparing = async (packageJSON, {
  appType,
  typescript,
  tester,
  codestyle,
  nogit
}, currentPath) => {
  switch (appType) {
    case 'csr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '17' },
          { name: 'react-dom', version: '17' },
          { name: 'react-redux', version: '7' },
          { name: 'react-router', version: '6' },
          { name: 'react-router-dom', version: '6' },
          { name: 'history', version: '5' },
          { name: 'react-helmet', version: '6' },
          { name: 'redux', version: '4' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: '@loadable/component', version: '5' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.36' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '17.0.8' },
            { name: '@types/react-dom', version: '17.0.5' },
            { name: '@types/node', version: '16' },
            { name: '@types/webpack-env', version: '1.16.2' }
          ]
        });
      } else {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: 'prop-types', version: '15' },
          ]
        });
      }
      break;

    case 'ssr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: 'react', version: '17' },
          { name: 'react-dom', version: '17' },
          { name: 'react-redux', version: '7' },
          { name: 'react-router', version: '6' },
          { name: 'react-router-dom', version: '6' },
          { name: 'history', version: '5' },
          { name: 'redux', version: '4' },
          { name: 'react-helmet-async', version: '1' },
          { name: '@issr/core', version: '1.1.0' },
          { name: 'node-fetch', version: '2' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: 'serialize-javascript', version: '5' },
          { name: 'pretty-error', version: '2' },
          { name: '@koa/router', version: '8' },
          { name: '@loadable/component', version: '5' },
          { name: '@loadable/server', version: '5' }
        ],
        devDependencies: [
          { name: '@issr/babel-plugin', version: '1.1.0' },
          { name: '@rockpack/compiler', version: '2.0.0-rc.36' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '17.0.8' },
            { name: '@types/react-dom', version: '17.0.5' },
            { name: '@types/koa', version: '2' },
            { name: '@types/koa-router', version: '7' },
            { name: '@types/node', version: '16' }
          ]
        });
      } else {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: 'prop-types', version: '15' },
          ]
        });
      }
      break;

    case 'library':
    case 'component':
      if (appType === 'component') {
        packageJSON = await addDependencies(packageJSON, {
          peerDependencies: [
            { name: 'react', version: '^17.0.0' },
            { name: 'react-dom', version: '^17.0.0' }
          ]
        });

        if (typescript) {
          packageJSON = await addDependencies(packageJSON, {
            devDependencies: [
              { name: '@types/react', version: '17.0.8' },
              { name: '@types/react-dom', version: '17.0.5' }
            ]
          });
        }
      }

      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.36' }
        ]
      });

      packageJSON = addFields(packageJSON, {
        main: 'dist/index.js'
      });

      if (typescript) {
        packageJSON = addFields(packageJSON, {
          types: 'dist/index.d.ts'
        });
      }

      const production = `${codestyle ? `${getPM()} run lint && ` : ''}${tester ? `${getPM()} test && ` : ''}${getPM()} run build && ${getPM()} publish`;

      packageJSON = addScripts(packageJSON, {
        production,
      });
      break;

    case 'nodejs':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.36' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          dependencies: [],
          devDependencies: [
            { name: '@types/node', version: '16' },
            { name: '@rockpack/compiler', version: '2.0.0-rc.36' }
          ]
        });
      }
      break;
  }

  if (appType === 'library' || appType === 'component') {
    packageJSON = addScripts(packageJSON, {
      start: 'node example/scripts.build',
      build: 'node scripts.build --mode=production',
      'build:example': 'node example/scripts.build --mode=production',
      analyzer: 'node scripts.build --analyzer'
    });

    const examplePath = path.resolve(currentPath, 'example');
    let packageJSONExample = await readPackageJSON(examplePath);

    if (appType === 'component') {
      packageJSONExample = await addDependencies(packageJSONExample, {
        dependencies: [
          { name: 'react', version: '17.0.2' },
          { name: 'react-dom', version: '17.0.2' }
        ]
      });
    }

    await writePackageJSON(examplePath, packageJSONExample);
  } else {
    packageJSON = addScripts(packageJSON, {
      start: 'node scripts.build',
      build: 'node scripts.build --mode=production',
      analyzer: 'node scripts.build --analyzer'
    });
  }

  if (codestyle) {
    packageJSON = addScripts(packageJSON, {
      lint: "eslint \"src/**\"",
    });
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: '@rockpack/codestyle', version: '2.0.0-rc.36' }
      ]
    });
  }

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: "node scripts.tests.js",
      "test:watch": "node scripts.tests.js --watch"
    });

    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: '@rockpack/tester', version: '2.0.0-rc.36' }
      ]
    });

    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: 'react-test-renderer', version: '17.0.2' },
          { name: '@testing-library/jest-dom', version: '5' },
          { name: '@testing-library/react', version: '11' },
          { name: '@testing-library/react-hooks', version: '7' }
        ]
      });
    }
  }

  if (!nogit) {
    let hooksCommon = [];
    let hooksCommit = [];
    let hooksPush = [];
    if (codestyle) {
      hooksCommon.push(`${getPM()} run lint`);
    }
    hooksCommit = hooksCommit.concat(hooksCommon);

    if (tester) {
      hooksPush = hooksPush.concat(hooksCommon);
      hooksPush.push(`${getPM()} test`);
    }

    hooksPush.push(`${getPM()} run build`);

    hooksCommit = hooksCommit.join(' && ');
    hooksPush = hooksPush.join(' && ');

    packageJSON = addFields(packageJSON, {
      'simple-git-hooks': {
        'pre-commit': hooksCommit,
        'pre-push': hooksPush
      }
    });

    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: 'simple-git-hooks', version: '2' }
      ]
    });
  }

  return packageJSON;
}

module.exports = packageJSONPreparing;
