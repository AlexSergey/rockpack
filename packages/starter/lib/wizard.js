const inquirer = require('inquirer');

const wizard = async () => {
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
        name: 'React SSR - React Server Side Rendering (Single page application + Node.js Application)',
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

  return {
    modules,
    appType,
    typescript,
    tester,
    codestyle
  }
}

module.exports = wizard;
