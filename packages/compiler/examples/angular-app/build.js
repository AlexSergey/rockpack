const path = require('path');
const { frontendCompiler } = require('../../index');

frontendCompiler({
  banner: true,
  src: './src/main.ts',
  html: {
    template: path.resolve(__dirname, './index.ejs')
  }
});
