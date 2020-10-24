const {
  addFields,
  addScripts,
  addDependencies
} = require('../utils/project');

const packageJSONPreparing = async (packageJSON, {
  modules,
  appType,
  typescript,
  tester,
  codestyle
}) => {
  switch (appType) {
    case 'csr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '1.1.0' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '16' },
            { name: '@types/react-dom', version: '16' }
          ]
        });
      } else {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: 'prop-types', version: '15.7.2' },
          ]
        });
      }
      break;

    case 'ssr-light':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
          { name: 'serialize-javascript', version: '5' },
          { name: 'isomorphic-style-loader', version: '5.1.0' },
          { name: 'pretty-error', version: '2.1.1' },
          { name: '@koa/router', version: '8' },
          { name: '@rockpack/ussr', version: '1.1.0' },
          { name: '@loadable/component', version: '5.13.1' },
          { name: '@loadable/server', version: '5.13.1' }
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '1.1.0' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '16' },
            { name: '@types/react-dom', version: '16' },
            { name: '@types/koa', version: '2' },
            { name: '@types/koa-router', version: '7' },
            { name: '@types/node', version: '14' }
          ]
        });
      } else {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: 'prop-types', version: '15.7.2' },
          ]
        });
      }
      break;

    case 'ssr-full':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
          { name: 'connected-react-router', version: '6.8.0' },
          { name: 'react-redux', version: '7.2.1' },
          { name: 'react-router', version: '5.2.0' },
          { name: 'react-router-dom', version: '5.2.0' },
          { name: 'redux', version: '4.0.5' },
          { name: 'redux-saga', version: '1.1.3' },
          { name: '@redux-saga/core', version: '1.1.3' },
          { name: 'react-helmet-async', version: '1.0.7' },
          { name: 'history', version: '4.10.1' },
          { name: 'node-fetch', version: '2.6.1' },
          { name: '@reduxjs/toolkit', version: '1.4.0' },
          { name: 'serialize-javascript', version: '5' },
          { name: 'isomorphic-style-loader', version: '5.1.0' },
          { name: 'pretty-error', version: '2.1.1' },
          { name: '@koa/router', version: '8' },
          { name: '@rockpack/ussr', version: '1.1.0' },
          { name: '@loadable/component', version: '5.13.1' },
          { name: '@loadable/server', version: '5.13.1' }
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '1.1.0' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '16' },
            { name: '@types/react-dom', version: '16' },
            { name: '@types/koa', version: '2' },
            { name: '@types/koa-router', version: '7' },
            { name: '@types/node', version: '14' }
          ]
        });
      } else {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: 'prop-types', version: '15.7.2' },
          ]
        });
      }
      break;

    case 'library':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '1.1.0' }
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

      const production = `${codestyle ? 'npm run lint && ' : ''}${typescript ? 'npm run typing && ' : ''}${tester ? 'npm test && ' : ''}npm run build && npm publish`;

      packageJSON = addScripts(packageJSON, {
        production,
      });
      break;

    case 'nodejs':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '1.1.0' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          dependencies: [],
          devDependencies: [
            { name: '@types/node', version: '14' },
            { name: '@rockpack/compiler', version: '1.1.0' }
          ]
        });
      }
      break;
  }

  packageJSON = addScripts(packageJSON, {
    start: 'cross-env NODE_ENV=development node scripts.build',
    build: 'cross-env NODE_ENV=production node scripts.build'
  });


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
        { name: '@rockpack/codestyle', version: '1.1.0' }
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
        { name: '@rockpack/tester', version: '1.1.0' }
      ]
    });
    if (appType === 'csr' || appType === 'ssr-light' || appType === 'ssr-full') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: 'enzyme', version: '3' },
          { name: 'enzyme-adapter-react-16', version: '1' },
          { name: '@testing-library/jest-dom', version: '5' },
          { name: '@testing-library/react', version: '11' }
        ]
      });
    }
  }

  if (modules.localization) {
    packageJSON = addScripts(packageJSON, {
      "localization:makePot": "node scripts.makePot",
      "localization:po2json": "node scripts.po2json",
    });
    packageJSON = await addDependencies(packageJSON, {
      dependencies: [
        { name: '@rockpack/localazer', version: '1.1.0' }
      ]
    });
  }
  if (modules.logger) {
    packageJSON = await addDependencies(packageJSON, {
      dependencies: [
        { name: '@rockpack/logger', version: '1.1.0' }
      ]
    });
  }

  return packageJSON;
}

module.exports = packageJSONPreparing;
