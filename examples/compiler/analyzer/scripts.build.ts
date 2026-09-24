import { frontendCompiler } from '@rockpack/compiler';

void frontendCompiler({
  analyzer: true,
  banner: true,
  styles: 'style.css',
});
