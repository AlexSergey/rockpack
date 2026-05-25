const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  banner: true,
  inline: false,
  styles: 'style.css',
  vendor: ['react', 'react-dom'],
});
