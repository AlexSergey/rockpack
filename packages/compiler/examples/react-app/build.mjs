import { frontendCompiler } from '../../lib/esm/index.mjs';

frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom'],
});
