let path = require('path');
let { markupCompiler } = require('../../index');

markupCompiler('./src/**/*.{html,hbs,jade,njk}', {
    html: {
        template: path.resolve(__dirname, './index.ejs')
    },
});
