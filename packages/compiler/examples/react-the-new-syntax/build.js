const { frontendCompiler } = require('../../index');

frontendCompiler({
  debug: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
