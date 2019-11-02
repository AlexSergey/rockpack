const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');
const fpPromise = require('../utils/findFreePort');

const mergeConfWithDefault = async (conf, mode) => {
    let c = deepExtend({}, defaultProps, conf);

    if (mode === 'development') {
        c.server.port = await fpPromise(c.server.port);
    }

    return c;
};

module.exports = mergeConfWithDefault;
