const { frontendCompiler } = require('../../src');

frontendCompiler({
  banner: true,
  inline: false,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
