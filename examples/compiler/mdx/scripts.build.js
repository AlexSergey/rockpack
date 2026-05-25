const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom'],
});
