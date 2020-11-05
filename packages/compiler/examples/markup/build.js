const { markupCompiler } = require('../../index');

markupCompiler('./src/**/*.{html,hbs,jade,njk,ejs}', {
  src: './src/style.scss'
});
