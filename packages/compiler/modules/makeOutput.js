let path = require('path');
let { isArray } = require('valid-types');

const getOutput = (conf = {}, root, version = '') => {
    let outputProps = {
        publicPath: conf.url,
        path: path.resolve(root, conf.dist)
    };
    if (!!conf.__frontendHasVendor) {
        outputProps.filename = version ? `[name]-${version}.js` : '[name].js';
    } else {
        if (isArray(conf.vendor)) {
            outputProps.filename = version ? `[name]-${version}.js` : '[name].js';
        }
        else {
            outputProps.filename = chunkData => {
                return chunkData.chunk.name === 'main' ?
                    (version ? `index-${version}.js` : 'index.js')
                    : version ? `[name]-${version}.js` : '[name].js';
            }
        }
    }

    if (conf.library) {
        Object.assign(outputProps, {
            library: conf.library,
            libraryTarget: 'umd',
            globalObject: 'this'
        });
    }

    return outputProps;
};

module.exports = getOutput;
