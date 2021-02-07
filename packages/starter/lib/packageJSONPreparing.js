const {
  addFields,
  addScripts,
  addDependencies
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
}) => {
  switch (appType) {
    case 'csr':
      packageJSON = await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
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
            { name: 'prop-types', version: '15' },
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
          { name: 'pretty-error', version: '2' },
          { name: '@issr/core', version: '1' },
          { name: '@koa/router', version: '8' },
          { name: '@loadable/component', version: '5' },
          { name: '@loadable/server', version: '5' }
        ],
        devDependencies: [
          { name: '@issr/babel-plugin', version: '1' },
          { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
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
            { name: 'prop-types', version: '15' },
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
          { name: 'connected-react-router', version: '6' },
          { name: 'react-redux', version: '7' },
          { name: 'react-router', version: '5' },
          { name: 'react-router-dom', version: '5' },
          { name: 'redux', version: '4' },
          { name: 'redux-saga', version: '1' },
          { name: '@redux-saga/core', version: '1' },
          { name: 'react-helmet-async', version: '1' },
          { name: 'history', version: '4' },
          { name: '@issr/core', version: '1' },
          { name: 'node-fetch', version: '2' },
          { name: '@reduxjs/toolkit', version: '1' },
          { name: 'serialize-javascript', version: '5' },
          { name: 'pretty-error', version: '2' },
          { name: '@koa/router', version: '8' },
          { name: '@loadable/component', version: '5' },
          { name: '@loadable/server', version: '5' }
        ],
        devDependencies: [
          { name: '@issr/babel-plugin', version: '1' },
          { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
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
            { name: 'prop-types', version: '15' },
          ]
        });
      }
      break;

    case 'library':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
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
          { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          dependencies: [],
          devDependencies: [
            { name: '@types/node', version: '14' },
            { name: '@rockpack/compiler', version: '2.0.0-rc.4' }
          ]
        });
      }
      break;
  }

  packageJSON = addScripts(packageJSON, {
    start: 'cross-env NODE_ENV=development node scripts.build',
    build: 'cross-env NODE_ENV=production node scripts.build',
    analyzer: 'cross-env NODE_ENV=development node scripts.build --analyzer'
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
        { name: '@rockpack/codestyle', version: '2.0.0-rc.4' }
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
        { name: '@rockpack/tester', version: '2.0.0-rc.4' }
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

  if (!nogit) {
    let huskyQuery = [];
    if (typescript) {
      huskyQuery.push(`${getPM()} run typing`);
    }
    if (codestyle) {
      huskyQuery.push(`${getPM()} run lint`);
    }
    if (tester) {
      huskyQuery.push(`${getPM()} test`);
    }
    huskyQuery = huskyQuery.join(' && ');

    packageJSON = addFields(packageJSON, {
      husky: {
        hooks: {
          'pre-commit': huskyQuery,
          'pre-push': huskyQuery
        }
      }
    });

    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: 'husky', version: '4' }
      ]
    });
  }

  return packageJSON;
}

module.exports = packageJSONPreparing;
