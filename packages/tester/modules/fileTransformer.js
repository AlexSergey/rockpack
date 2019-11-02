const path = require('path');

module.exports = {
    process: function(src, filename, config, options) {
        return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
    }
};
