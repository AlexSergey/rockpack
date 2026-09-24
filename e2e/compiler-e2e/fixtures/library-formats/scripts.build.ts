import { libraryCompiler } from '@rockpack/compiler';

void libraryCompiler({
  cjs: { dist: './lib/cjs', src: './src' },
  esm: { dist: './lib/esm', src: './src' },
  externals: ['react', 'react-dom', 'react/jsx-runtime'],
  name: 'Formats',
});
