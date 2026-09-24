import webpack from 'webpack';

import * as compiler from './index.js';

jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('yargs', () => jest.fn(() => ({ parseSync: (): Record<string, unknown> => ({ mode: 'production' }) })));
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));
jest.mock('./compilers/backend-compiler.js', () => ({ backendCompiler: 'backendCompiler' }));
jest.mock('./compilers/frontend-compiler.js', () => ({ frontendCompiler: 'frontendCompiler' }));
jest.mock('./compilers/isomorphic-compiler.js', () => ({ isomorphicCompiler: 'isomorphicCompiler' }));
jest.mock('./compilers/library-compiler.js', () => ({ libraryCompiler: 'libraryCompiler' }));
jest.mock('./compilers/make-webpack-config.js', () => ({ makeWebpackConfig: 'makeWebpackConfig' }));
jest.mock('./compilers/source-compiler.js', () => ({ sourceCompiler: 'sourceCompiler' }));

describe('@rockpack/compiler', () => {
  describe('negative cases', () => {
    it('does not export a default', () => {
      expect(Object.keys(compiler)).not.toContain('default');
    });
  });

  describe('positive cases', () => {
    it('exports the compilers and helpers', () => {
      expect(Object.keys(compiler).sort()).toEqual([
        'backendCompiler',
        'frontendCompiler',
        'getArgs',
        'getWebpack',
        'isomorphicCompiler',
        'libraryCompiler',
        'makeWebpackConfig',
        'sourceCompiler',
      ]);
    });

    it('exposes the parsed arguments and the webpack instance', () => {
      expect(compiler.getArgs()).toEqual({ mode: 'production' });
      expect(compiler.getWebpack()).toBe(webpack);
    });
  });
});
