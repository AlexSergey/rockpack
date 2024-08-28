const path = require('path');

const { markupCompiler } = require('../../index');

markupCompiler('./src/**/*.{html,hbs,jade,njk,ejs}', {
  html: {
    template: path.resolve(__dirname, './index.ejs'),
  },
  src: './src/style.scss',
});
