import { frontendCompiler } from '@rockpack/compiler';

void frontendCompiler({
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'antd'],
});
