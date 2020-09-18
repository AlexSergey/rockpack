#!/usr/bin/env node

require('colors');
const fs = require('fs');
const ora = require('ora');
const path = require('path');
const inquirer = require('inquirer');
const {
  addons,
  backbone,
  currentPath
} = require('../utils/pathes');
const {
  createProject,
  npmInstall,
  projectIsReadyForSetup,
  readPackageJSON,
  addLibraries,
  addScripts,
  writePackageJSON
} = require('../utils/project');
const copy = require('../utils/copy');

(async () => {
  await projectIsReadyForSetup(currentPath, {
    onPackageJSONNotFound: async () => {
      await createProject();
      console.log('Package.json created\n'.green);
    },
    onSrcFolderNotFound: () => {
      const src = path.resolve(currentPath, 'src');
      fs.mkdirSync(src);
      console.log(`${src} folder created\n`.underline.green);
    },
    onSrcFolderNotEmpty: () => {
      console.error('"src" folder is not empty. Please use manual installation:'.underline.red);
      console.log('\n@rockpack/compiler - https://github.com/AlexSergey/rock/blob/master/packages/compiler/README.md');
      console.log('\n@rockpack/ussr - https://github.com/AlexSergey/rock/blob/master/packages/ussr/README.md');
      console.log('\n@rockpack/tester - https://github.com/AlexSergey/rock/blob/master/packages/tester/README.md');
      console.log('\n@rockpack/codestyle - https://github.com/AlexSergey/rock/blob/master/packages/codestyle/README.md');
      console.log('\n@rockpack/logger - https://github.com/AlexSergey/rock/blob/master/packages/logger/README.md');
      console.log('\n@rockpack/localazer - https://github.com/AlexSergey/rock/blob/master/packages/localazer/README.md');
      return process.exit(1);
    }
  });

  const prompt = inquirer.createPromptModule();

  const modules = {
    logger: false,
    localization: false
  }

  const { appType } = await prompt({
    type: 'list',
    name: 'appType',
    message: 'Which is type of application would you build?',
    choices: [
      {
        name: 'React CSR - React Client Side Render (Single page application)',
        value: 'csr',
        checked: false
      },
      {
        name: 'React SSR - React Server Side Render (Single page application + Node.js Application)',
        value: 'ssr',
        checked: false
      },
      {
        name: 'Simple Library (UMD Library)',
        value: 'library',
        checked: false
      },
      {
        name: 'Node.js Application',
        value: 'nodejs',
        checked: false
      }
    ]
  });

  const { typescript } = await prompt({
    type: 'confirm',
    name: 'typescript',
    message: 'Do you want typescript support?'
  });

  const { tester } = await prompt({
    type: 'confirm',
    name: 'tester',
    message: 'Do you want tests?'
  });

  const { codestyle } = await prompt({
    type: 'confirm',
    name: 'codestyle',
    message: 'Do you want ESLint?'
  });

  if (appType === 'csr' || appType === 'ssr') {
    const { logger } = await prompt({
      type: 'confirm',
      name: 'logger',
      message: 'Do you want logger?'
    });

    if (logger) {
      modules.logger = true;
    }

    const { localization } = await prompt({
      type: 'confirm',
      name: 'localization',
      message: 'Do you want localization?'
    });

    if (logger) {
      modules.logger = true;
    }

    if (localization) {
      modules.localization = true;
    }
  }
  // Setup
  let packageJSON = await readPackageJSON(currentPath);

  switch (appType) {
    case 'csr':
      packageJSON = typescript ? await addLibraries(packageJSON, {
        dependencies: [
          { name: 'react', version: '16' },
          { name: 'react-dom', version: '16' },
        ],
        devDependencies: [
          { name: '@types/react', version: '16' },
          { name: '@types/react-dom', version: '16' },
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      }) : await addLibraries(packageJSON, {
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
      packageJSON = typescript ? await addLibraries(packageJSON, {
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
      }) : await addLibraries(packageJSON, {
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
      packageJSON = await addLibraries(packageJSON, {
        devDependencies: [
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      });

      break;

    case 'nodejs':
      packageJSON = typescript ? await addLibraries(packageJSON, {
        dependencies: [],
        devDependencies: [
          { name: '@types/node', version: '14' },
          { name: '@rockpack/compiler', version: '0.9.9-rc.3' }
        ]
      }) : await addLibraries(packageJSON, {
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

  await copy(
    path.join(backbone, appType, typescript ? 'typescript' : 'simple'),
    path.join(currentPath)
  );

  if (codestyle) {
    packageJSON = addScripts(packageJSON, {
      lint: "cross-env NODE_ENV=production eslint \"src/**\"",
    });
    packageJSON = await addLibraries(packageJSON, {
      devDependencies: [
        { name: '@rockpack/codestyle', version: '0.9.9-rc.3' }
      ]
    });
    await copy(
      path.join(addons, 'codestyle', 'common'),
      path.join(currentPath)
    );
  }

  if (tester) {
    packageJSON = addScripts(packageJSON, {
      test: "node scripts.tests.js",
      "test:watch": "node scripts.tests.js --watch"
    });

    if (appType === 'csr' || appType === 'ssr') {
      packageJSON = await addLibraries(packageJSON, {
        devDependencies: [
          { name: 'enzyme', version: '3' },
          { name: 'enzyme-adapter-react-16', version: '1' },
        ]
      });
      await copy(
        path.join(addons, 'tester', 'react-common'),
        path.join(currentPath)
      );
    } else {
      await copy(
        path.join(addons, 'tester', 'common'),
        path.join(currentPath)
      );
    }
  }

  if (modules.localization && modules.logger) {
    packageJSON = addScripts(packageJSON, {
      "localization:makePo": "node scripts.makePo",
      "localization:po2json": "node scripts.po2json",
    });
    packageJSON = await addLibraries(packageJSON, {
      dependencies: [
        { name: '@rockpack/localazer', version: '0.9.9-rc.3' },
        { name: '@rockpack/logger', version: '0.9.9-rc.3' }
      ]
    });
    await copy(
      path.join(addons, 'logger-localazer', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  } else if (!modules.localization && modules.logger) {
    packageJSON = await addLibraries(packageJSON, {
      dependencies: [
        { name: '@rockpack/logger', version: '0.9.9-rc.3' }
      ]
    });
    await copy(
      path.join(addons, 'logger', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  } else if (modules.localization && !modules.logger) {
    packageJSON = addScripts(packageJSON, {
      "localization:makePo": "node scripts.makePo",
      "localization:po2json": "node scripts.po2json",
    });
    packageJSON = await addLibraries(packageJSON, {
      dependencies: [
        { name: '@rockpack/localazer', version: '0.9.9-rc.3' }
      ]
    });
    await copy(
      path.join(addons, 'localazer', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  }
  const spinner = ora('Project is initializing... It takes 2 - 5 minutes').start();
  await writePackageJSON(currentPath, packageJSON);

  await npmInstall();
  spinner.stop();
})();
