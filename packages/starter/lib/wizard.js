const inquirer = require('inquirer');

const wizard = async () => {
  const prompt = inquirer.createPromptModule();

  const { appType } = await prompt({
    type: 'list',
    name: 'appType',
    message: 'Which is type of application would you build?',
    choices: [
      {
        name: '• React CSR - React Client Side Render (Single page application)',
        value: 'csr',
        checked: false
      },
      {
        name: '• React SSR Light Pack - SSR, CSS Modules, @loadable etc',
        value: 'ssr-light',
        checked: false
      },
      {
        name: '• React SSR Full Pack - SSR, SEO, Redux, Sagas, React-Router, CSS Modules, @loadable, project structure etc',
        value: 'ssr-full',
        checked: false
      },
      {
        name: '• Simple Library (UMD Library)',
        value: 'library',
        checked: false
      },
      /*{
        name: '• Node.js Application',
        value: 'nodejs',
        checked: false
      }*/
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

  return {
    appType,
    typescript,
    tester,
    codestyle
  }
}

module.exports = wizard;
