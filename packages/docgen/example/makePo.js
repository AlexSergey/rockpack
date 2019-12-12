const { localazer } = require('../../compiler');
const { resolve } = require('path');

localazer.makePo({
    inline: false
}, config => {
    Object.assign(config.resolve, {
        alias: {
            assets: resolve(__dirname, '../lib/assets')
        }
    });
});
