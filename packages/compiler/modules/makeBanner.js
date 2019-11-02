const { existsSync, readFileSync } = require('fs');
const path = require('path');

const makeBanner = (packageJson) => {
    let banner = existsSync(path.resolve(__dirname, '..', './banner')) ? readFileSync(path.resolve(__dirname, '..', './banner'), 'utf8') : '';

    if (!!banner) {
        let types = ['name', 'version', 'author', 'email', 'description', 'license'];

        types.forEach(type => {
            if (banner.indexOf(type) > 0 && !!packageJson[type]) {
                banner = banner.replace(`$\{${type}\}`, packageJson[type]);
            }
        });
        types.forEach(type => (banner = banner.replace(`$\{${type}\}`, '')));

        banner = banner
            .split('\n')
            .filter(i => i !== '')
            .filter(item => item !== '\r' && item !== '\n')
            .join('\n');

        return banner;
    } else {
        return false;
    }
};

module.exports = makeBanner;