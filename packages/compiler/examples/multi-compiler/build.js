const { multiCompiler, webViewCompiler, frontendCompiler } = require('../../index');

multiCompiler(
  frontendCompiler({
    dist: './public',
    banner: true,
    styles: 'style.css',
    vendor: ['react', 'react-dom', 'core-js']
  }),
  webViewCompiler()
);
