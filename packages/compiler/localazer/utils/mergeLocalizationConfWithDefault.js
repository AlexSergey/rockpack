const deepExtend = require('deep-extend');
const defaultProps = require('../defaultProps');

const mergeLocalizationConfWithDefault = async (conf) => deepExtend({}, defaultProps, conf);

module.exports = mergeLocalizationConfWithDefault;
