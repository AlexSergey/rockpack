const getAllLocalizationData = require('./getAllLocalizationData');
const defaultOptions = require('./defaultOptions');
const generatePOTFile = require('./generatePOTFile');
const { prepareOptions } = require('../utils');
const colors = require('colors/safe');

module.exports = async function(opts = {}) {
    try {
        let options = await prepareOptions(defaultOptions, opts);
        let results = await getAllLocalizationData(options);
        await generatePOTFile(results, options);
        console.log(colors.rainbow('========================='));
    }
    catch (err) {
        console.log(colors.red.underline(`Error: ${err}`));
        process.exit(1);
    }
    console.log(colors.green('Everything has compiled !'));
    process.exit();
};