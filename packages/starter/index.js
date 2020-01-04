const inquirer = require('inquirer');
const { argv } = require('yargs');

(async () => {
    const libraryName = argv._[0];
    const prompt = inquirer.createPromptModule();
    const defaultProps = {
        version: '1.0.0'
    };
    const a = await prompt({
        type: 'input',
        name: 'test',
        message: 'message'
    });
    const n = await prompt({
        type: 'list',
        name: 'test',
        message: 'message',
        choices: [

        ]
    });
    console.log(a, n, libraryName);
})();
