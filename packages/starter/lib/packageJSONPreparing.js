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
          { name: '@rockpack/compiler', version: '0.9.9-rc.14' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          devDependencies: [
            { name: '@types/react', version: '16' },
            { name: '@types/react-dom', version: '16' }
          ]
        });
      }
      break;

    case 'ssr':
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
          { name: '@rockpack/ussr', version: '0.9.9-rc.14' },
          { name: '@loadable/component', version: '5.13.1' },
          { name: '@loadable/server', version: '5.13.1' }
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.14' }
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
      }
      break;

    case 'library':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.14' }
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
      break;

    case 'nodejs':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.14' }
        ]
      });

      if (typescript) {
        packageJSON = await addDependencies(packageJSON, {
          dependencies: [],
          devDependencies: [
            { name: '@types/node', version: '14' },
            { name: '@rockpack/compiler', version: '0.9.9-rc.14' }
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
      lint: "cross-env NODE_ENV=production eslint \"**\"",
    });
    packageJSON = await addDependencies(packageJSON, {
      devDependencies: [
        { name: '@rockpack/codestyle', version: '0.9.9-rc.14' }
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
        { name: '@rockpack/tester', version: '0.9.9-rc.14' }
      ]
    });
    if (appType === 'csr' || appType === 'ssr') {
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
        { name: '@rockpack/localazer', version: '0.9.9-rc.14' }
      ]
    });
  }
  if (modules.logger) {
    packageJSON = await addDependencies(packageJSON, {
      dependencies: [
        { name: '@rockpack/logger', version: '0.9.9-rc.14' }
      ]
    });
  }

  return packageJSON;
}

module.exports = packageJSONPreparing;
