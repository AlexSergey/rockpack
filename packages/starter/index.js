const inquirer = require('inquirer');

const REPO = 'single';

const SETTINGS = {
    git: true,
    typescript: true, // true|false
    documentation: false, //true|false
    localization: false, //
    ssr: false,
    logger: false,
    testing: false
};

const MESSAGES = {
    single: 'Single repository',
    mono: 'Mono repository',
    git: 'Git',
    typescript: 'Typescript',
    documentation: 'Documentation',
    localization: 'Localization',
    ssr: 'Server Side Rendering',
    logger: 'Logger',
    testing: 'Testing'
};

(async () => {
    const starter = {};
    const prompt = inquirer.createPromptModule();
    const { repo } = await prompt({
        type: 'list',
        name: 'repo',
        message: 'Type of repository',
        choices: [
            {name: MESSAGES.single, value: 'single'},
            {name: MESSAGES.mono, value: 'mono'},
        ]
    });

    const { settings } = await prompt({
        type: 'checkbox',
        name: 'settings',
        message: 'What do you want?',
        choices: Object.keys(SETTINGS).map(key => ({
            name: MESSAGES[key],
            value: key,
            checked: SETTINGS[key]
        }))
    });

    Object.keys(starter).forEach(key => {
        starter[key] = false;
    });
    starter.repo = repo;
    settings.forEach(key => {
        starter[key] = true;
    });
    console.log(starter);
    const postfix = '\n';

    const message = Object.keys(starter).reduce((str, key) => {
        if (starter[key]) {
            str += key === 'repo' ?
                `${MESSAGES[starter[key]]}${postfix}` :
                `${MESSAGES[key]}${postfix}`;
        }
        return str;
    }, postfix);

    const { confirm } = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Please, check your setup: ${message}`
    });

    if (confirm) {

    }
})();
