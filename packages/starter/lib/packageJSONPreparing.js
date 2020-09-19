const {
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
      packageJSON = typescript ? await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
        ],
        devDependencies: [
          { name: '@types/react', version: '16' },
          { name: '@types/react-dom', version: '16' },
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      }) : await addDependencies(packageJSON, {
        dependencies: [
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      });
      break;

    case 'ssr':
      packageJSON = typescript ? await addDependencies(packageJSON, {
        dependencies: [
          { name: '@rockpack/ussr', version: '0.9.9-rc.3' },
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: '@koa/router', version: '8' },
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
          { name: 'serialize-javascript', version: '5' }
        ],
        devDependencies: [
          { name: '@types/react', version: '16' },
          { name: '@types/react-dom', version: '16' },
          { name: '@types/koa', version: '2' },
          { name: '@types/koa-router', version: '7' },
          { name: '@types/koa-router', version: '4' },
          { name: '@types/node', version: '14' },
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      }) : await addDependencies(packageJSON, {
        dependencies: [
          { name: '@rockpack/ussr', version: '0.9.9-rc.3' },
          { name: 'koa', version: '2' },
          { name: 'koa-static', version: '5' },
          { name: '@koa/router', version: '8' },
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
          { name: 'serialize-javascript', version: '5' }
        ],
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      });
      break;

    case 'library':
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      });

      break;

    case 'nodejs':
      packageJSON = typescript ? await addDependencies(packageJSON, {
        dependencies: [],
        devDependencies: [
          { name: '@types/node', version: '14' },
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      }) : await addDependencies(packageJSON, {
        dependencies: [],
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      });
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
        { name: '@rockpack/codestyle', version: '0.9.9-rc.3' }
      ]
    });
  }
  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: "node scripts.tests.js",
      "test:watch": "node scripts.tests.js --watch"
    });
    if (appType === 'csr' || appType === 'ssr') {
      packageJSON = await addDependencies(packageJSON, {
        devDependencies: [
          { name: 'enzyme', version: '3' },
          { name: 'enzyme-adapter-react-16', version: '1' },
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
        { name: '@rockpack/localazer', version: '0.9.9-rc.3' }
      ]
    });
  }
  if (modules.logger) {
    packageJSON = await addDependencies(packageJSON, {
      dependencies: [
        { name: '@rockpack/logger', version: '0.9.9-rc.3' }
      ]
    });
  }

  return packageJSON;
}

module.exports = packageJSONPreparing;
