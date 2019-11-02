const defaultOptions = require('./defaultOptions');
const { prepareOptions } = require('../utils');
const make = require('./make');
const colors = require('colors/safe');

module.exports = async function(opts = {}) {
    try {
        let options = await prepareOptions(defaultOptions, opts);
        await make(options);
        console.log(colors.rainbow('========================='));
    }
    catch (err) {
        console.log(colors.red.underline(`Error: ${err}`));
        process.exit(1);
    }
    console.log(colors.green('Everything has compiled !'));
    process.exit();
};