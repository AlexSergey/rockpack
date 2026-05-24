const { frontendCompiler } = require('../../src');

frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
