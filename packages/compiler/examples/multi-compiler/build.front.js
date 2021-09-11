const { frontendCompiler } = require('../../index');

frontendCompiler({
  dist: './public',
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js']
})
