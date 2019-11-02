const moment = require('moment');

const makeVersion = (conf) => {
    if (conf.version) {
        return moment().format('DDMM-hhmm');
    }
    return false;
};

module.exports = makeVersion;