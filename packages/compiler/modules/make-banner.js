const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');

const makeBanner = (packageJson) => {
  let banner = existsSync(path.resolve(__dirname, '..', './banner'))
    ? readFileSync(path.resolve(__dirname, '..', './banner'), 'utf8')
    : '';

  if (banner) {
    const types = ['name', 'version', 'author', 'email', 'description', 'license'];

    types.forEach((type) => {
      if (banner.indexOf(type) > 0 && !!packageJson[type]) {
        banner = banner.replace(`$\{${type}\}`, packageJson[type]);
      }
    });
    types.forEach((type) => {
      banner = banner.replace(`$\{${type}\}`, '');
    });

    banner = banner
      .split('\n')
      .filter((i) => i !== '')
      .filter((item) => item !== '\r' && item !== '\n')
      .join('\n');

    return banner;
  }

  return false;
};

module.exports = makeBanner;
