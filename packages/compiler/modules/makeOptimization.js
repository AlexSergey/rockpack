let { isArray } = require('valid-types');

const makeOptimization = conf => {
    let optimization = {};
    if (conf.vendor) {
        Object.assign(optimization, {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: 'initial',
                        name: 'vendor',
                        test: 'vendor',
                        enforce: true
                    },
                }
            }
        })
    }

    return optimization;
};

module.exports = makeOptimization;
