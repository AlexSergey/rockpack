const { frontendCompiler } = require('../../index');

frontendCompiler({
  banner: true,
  dist: './public',
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js'],
});
