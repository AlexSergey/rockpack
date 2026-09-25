import { libraryCompiler } from '@rockpack/compiler';

// The custom list replaces the defaults, so the specs are listed again.
void libraryCompiler(
  {
    cjs: { dist: './lib/cjs', src: './src' },
    esm: { dist: './lib/esm', src: './src' },
    externals: ['react', 'react-dom', 'react/jsx-runtime'],
    name: 'Formats',
  },
  { ignore: ['**/*.spec.ts', '**/drafts/**'] },
);
