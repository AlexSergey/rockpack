import { setMode } from '@rockpack/utils';

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
const configResult = { conf: {}, kind: 'config', webpackConfig: {} };
const watchResult = { compiler: {}, conf: {}, kind: 'watch', stop: jest.fn(), webpackConfig: {} };
const serverResult = { kind: 'dev-server', stop: jest.fn(), url: 'http://localhost:3000' };

describe('frontendCompiler', () => {
  beforeEach(() => {
    setModeMock.mockReturnValue('development');
    (compile as jest.Mock).mockResolvedValue(watchResult);
    (devServer as jest.Mock).mockResolvedValue(serverResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('returns a finished production build without a dev server', async () => {
      const build = { kind: 'build', stats: undefined, success: true };
      (compile as jest.Mock).mockResolvedValue(build);

      await expect(frontendCompiler()).resolves.toBe(build);
      expect(devServer).not.toHaveBeenCalled();
    });

    it('returns the config without a dev server when only the config is requested', async () => {
      (compile as jest.Mock).mockResolvedValue(configResult);

      await expect(frontendCompiler({}, undefined, true)).resolves.toBe(configResult);
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

    it('starts the dev server on a watching build and returns it', async () => {
      await expect(frontendCompiler()).resolves.toBe(serverResult);

      expect(devServer).toHaveBeenCalledWith(watchResult);
    });
  });
});
