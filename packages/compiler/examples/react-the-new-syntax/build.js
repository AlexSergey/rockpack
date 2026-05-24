const { frontendCompiler } = require('../../src');

frontendCompiler({
  debug: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
