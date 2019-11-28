const fs = require('fs');
const extend = require('deep-extend');

let custom = {};

if (fs.existsSync('./.prettierrc.custom.js')) {
    custom = require('./.prettierrc.custom.js');
}

module.exports = extend(
    {},
    {
        endOfLine: 'lf',
        trailingComma: 'es5',
        editorconfig: true,
        semi: true,
        singleQuote: true,
    },
    custom
);
