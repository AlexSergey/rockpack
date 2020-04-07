const path = require('path');
const { markupCompiler } = require('../../index');

markupCompiler('./src/**/*.{html,hbs,jade,njk}', {
  html: {
    template: path.resolve(__dirname, './index.ejs')
  },
});
