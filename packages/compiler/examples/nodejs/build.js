const path = require('path');
let { backendCompiler } = require('../../index');

backendCompiler({}, finalConfig => {
    Object.assign(finalConfig.resolve, {
        alias: {
            text: path.resolve('./text')
        }
    });
});