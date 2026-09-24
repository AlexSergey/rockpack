import { setMode } from '@rockpack/utils';

import { compile } from '../core/compile.js';
import { errorHandler } from '../error-handler.js';
import { backendCompiler } from './backend-compiler.js';

jest.mock('@rockpack/utils', () => ({ setMode: jest.fn() }));
jest.mock('../core/compile.js', () => ({ compile: jest.fn(() => Promise.resolve('compiled')) }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

describe('backendCompiler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('disables html even when it is requested', async () => {
      await backendCompiler({ html: true });

      expect(compile).toHaveBeenCalledWith(expect.objectContaining({ html: false }), null, false);
    });
  });

  describe('positive cases', () => {
    it('compiles a named node config', async () => {
      const post = jest.fn();

      await expect(backendCompiler({ src: 'src/server.ts' }, post, true)).resolves.toBe('compiled');
      expect(setMode).toHaveBeenCalledWith(['development', 'production'], 'development');
      expect(errorHandler).toHaveBeenCalled();
      expect(compile).toHaveBeenCalledWith(
        {
          __isBackend: true,
          compilerName: 'backendCompiler',
          html: false,
          name: 'backendCompiler',
          nodejs: true,
          src: 'src/server.ts',
        },
        post,
        true,
      );
    });
  });
});
