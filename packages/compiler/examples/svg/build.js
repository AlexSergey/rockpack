const { frontendCompiler } = require('../../index');

frontendCompiler({
  banner: true,
  inline: false,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
