import { setMode } from '@rockpack/utils';

import { setLegacyIsomorphicContext } from '../core/compile-context.js';
import { compile } from '../core/compile.js';
import { devServer } from '../core/dev-server.js';
import { errorHandler } from '../error-handler.js';
import { frontendCompiler } from './frontend-compiler.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  setMode: jest.fn(),
}));
jest.mock('../core/compile.js', () => ({ compile: jest.fn() }));
jest.mock('../core/dev-server.js', () => ({ devServer: jest.fn() }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

const setModeMock = setMode as jest.MockedFunction<typeof setMode>;
const compileResult = { compiler: {}, conf: {}, webpackConfig: {} };

describe('frontendCompiler', () => {
  beforeEach(() => {
    setModeMock.mockReturnValue('development');
    (compile as jest.Mock).mockResolvedValue(compileResult);
  });

  afterEach(() => {
    setLegacyIsomorphicContext(undefined);
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('does not start the dev server in production', async () => {
      setModeMock.mockReturnValue('production');

      await expect(frontendCompiler()).resolves.toBeUndefined();
      expect(devServer).not.toHaveBeenCalled();
    });

    it('returns the config without a dev server when only the config is requested', async () => {
      await expect(frontendCompiler({}, undefined, true)).resolves.toBe(compileResult);
      expect(devServer).not.toHaveBeenCalled();
    });

    it('returns the config without a dev server in legacy isomorphic builds', async () => {
      setLegacyIsomorphicContext({ configOnly: true, isomorphic: true });

      await expect(frontendCompiler()).resolves.toBe(compileResult);
      expect(devServer).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('compiles a named frontend config with the error handler installed', async () => {
      const post = jest.fn();

      await frontendCompiler({ src: 'src/app.tsx' }, post);

      expect(setModeMock).toHaveBeenCalledWith(['development', 'production'], 'development');
      expect(errorHandler).toHaveBeenCalled();
      expect(compile).toHaveBeenCalledWith(
        { compilerName: 'frontendCompiler', name: 'frontendCompiler', src: 'src/app.tsx' },
        post,
        false,
      );
    });

    it('starts the dev server in development', async () => {
      await frontendCompiler();

      expect(devServer).toHaveBeenCalledWith(compileResult);
    });
  });
});
