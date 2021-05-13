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
          { name: 'connected-react-router', version: '6' },
          { name: 'react-redux', version: '7' },
          { name: 'react-router', version: '5' },
          { name: 'react-router-dom', version: '5' },
          { name: 'react-helmet', version: '6' },
          { name: 'redux', version: '4' },
          { name: 'redux-saga', version: '1' },
          { name: '@redux-saga/core', version: '1' },
          { name: 'history', version: '4' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: '@loadable/component', version: '5' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.10' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '17' },
            { name: '@types/react-dom', version: '17' },
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
          { name: 'connected-react-router', version: '6' },
          { name: 'react-redux', version: '7' },
          { name: 'react-router', version: '5' },
          { name: 'react-router-dom', version: '5' },
          { name: 'redux', version: '4' },
          { name: 'redux-saga', version: '1' },
          { name: '@redux-saga/core', version: '1' },
          { name: 'react-helmet-async', version: '1' },
          { name: 'history', version: '4' },
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
          { name: '@rockpack/compiler', version: '2.0.0-rc.10' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '17' },
            { name: '@types/react-dom', version: '17' },
            { name: '@types/koa', version: '2' },
            { name: '@types/koa-router', version: '7' },
            { name: '@types/node', version: '14' }
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
            { name: 'react', version: '17' },
          ]
        });

        if (typescript) {
          packageJSON = await addDependencies(packageJSON, {
            devDependencies: [
              { name: '@types/react', version: '17' },
            ]
          });
        }
      }

      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.10' }
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

      const production = `${codestyle ? `${getPM()} run lint && ` : ''}${typescript ? `${getPM()} run typing && ` : ''}${tester ? `${getPM()} test && ` : ''}${getPM()} run build && ${getPM()} publish`;

      packageJSON = addScripts(packageJSON, {
        production,
      });
      break;

    case 'nodejs':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.10' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          dependencies: [],
          devDependencies: [
            { name: '@types/node', version: '14' },
            { name: '@rockpack/compiler', version: '2.0.0-rc.10' }
          ]
        });
      }
      break;
  }

  if (appType === 'library' || appType === 'component') {
    packageJSON = addScripts(packageJSON, {
      build: 'cross-env NODE_ENV=production node scripts.build',
      analyzer: 'cross-env NODE_ENV=development node scripts.build --analyzer'
    });

    const examplePath = path.resolve(currentPath, 'example');
    let packageJSONExample = await readPackageJSON(examplePath);

    packageJSONExample = await addDependencies(packageJSONExample, {
      devDependencies: [
        { name: 'cross-env', version: '7' }
      ]
    });

    packageJSONExample = addScripts(packageJSONExample, {
      build: 'cross-env NODE_ENV=production node scripts.build'
    });

    if (appType === 'component') {
      packageJSONExample = await addDependencies(packageJSONExample, {
        dependencies: [
          { name: 'react', version: '17' },
          { name: 'react-dom', version: '17' }
        ]
      });
    }

    await writePackageJSON(examplePath, packageJSONExample);
  } else {
    packageJSON = addScripts(packageJSON, {
      start: 'cross-env NODE_ENV=development node scripts.build',
      build: 'cross-env NODE_ENV=production node scripts.build',
      analyzer: 'cross-env NODE_ENV=development node scripts.build --analyzer'
    });
  }

  if (typescript) {
    packageJSON = addScripts(packageJSON, {
      typing: "cross-env NODE_ENV=production tsc -p . --noEmit",
    });
  }

  if (codestyle) {
    packageJSON = addScripts(packageJSON, {
      lint: "cross-env NODE_ENV=production eslint \"src/**\"",
    });
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: '@rockpack/codestyle', version: '2.0.0-rc.10' }
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
        { name: '@rockpack/tester', version: '2.0.0-rc.10' }
      ]
    });

    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: 'enzyme', version: '3' },
          { name: '@wojtekmaj/enzyme-adapter-react-17', version: '0.6.1' },
          { name: '@testing-library/jest-dom', version: '5' },
          { name: '@testing-library/react', version: '11' }
        ]
      });
    }
  }

  if (!nogit) {
    let hooksCommon = [];
    let hooksCommit = [];
    let hooksPush = [];
    if (typescript) {
      hooksCommon.push(`${getPM()} run typing`);
    }
    if (codestyle) {
      hooksCommon.push(`${getPM()} run lint`);
    }
    hooksCommit = hooksCommit.concat(hooksCommon);

    if (tester) {
      hooksPush = hooksPush.concat(hooksCommon);
      hooksPush.push(`${getPM()} test`);
    }
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
