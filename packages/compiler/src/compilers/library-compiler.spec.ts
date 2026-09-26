import { compile } from '../core/compile.js';
import { libraryCompiler } from './library-compiler.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  setMode: jest.fn(),
}));
jest.mock('../core/compile.js', () => ({ compile: jest.fn(() => Promise.resolve('compiled')) }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

const compileMock = compile as jest.MockedFunction<typeof compile>;
const compiledConf = (): Record<string, unknown> => compileMock.mock.calls[0]?.[0] as Record<string, unknown>;

describe('libraryCompiler', () => {
  const originalExitCode = process.exitCode;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // The error boundary marks the exit code on purpose; keep the Jest process status clean.
    process.exitCode = originalExitCode;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('exits for options that are neither a name nor an object with a name', async () => {
      await expect(libraryCompiler({ esm: { dist: 'lib', src: 'src' } } as never)).rejects.toMatchObject({
        code: 'INVALID_CONFIG',
        message: expect.stringContaining('Object is not correct') as unknown,
      });
      expect(compile).not.toHaveBeenCalled();
    });

    it('ignores empty externals', async () => {
      await libraryCompiler({ externals: [], name: 'MyLib' });

      expect(compiledConf()).not.toHaveProperty('externals');
    });
  });

  describe('positive cases', () => {
    it('builds a library from a name', async () => {
      await expect(libraryCompiler({ name: 'MyLib' }, { src: 'src/index.ts' })).resolves.toBe('compiled');

      expect(compile).toHaveBeenCalledWith(
        {
          __library: true,
          compilerName: 'libraryCompiler',
          html: false,
          library: 'MyLib',
          name: 'libraryCompiler',
          src: 'src/index.ts',
        },
        null,
        false,
      );
    });

    it('still accepts the deprecated name string', async () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      await libraryCompiler('MyLib');

      expect(compiledConf()).toMatchObject({ library: 'MyLib' });
    });

    it('builds a library with externals and esm/cjs outputs', async () => {
      await libraryCompiler({
        cjs: { dist: 'lib/cjs', src: 'src' },
        esm: { dist: 'lib/esm', src: 'src' },
        externals: ['react'],
        name: 'MyLib',
      });

      expect(compiledConf()).toMatchObject({
        cjs: { dist: 'lib/cjs', src: 'src' },
        esm: { dist: 'lib/esm', src: 'src' },
        externals: ['react'],
        library: 'MyLib',
      });
    });

    it('keeps an explicit html option', async () => {
      await libraryCompiler({ name: 'MyLib' }, { html: { title: 'Demo' } });

      expect(compiledConf()['html']).toEqual({ title: 'Demo' });
    });

    it('builds a node library as a backend without html', async () => {
      await libraryCompiler({ name: 'MyLib' }, { html: true, nodejs: true }, undefined, true);

      expect(compiledConf()).toMatchObject({ __isBackend: true, html: false, nodejs: true });
      expect(compileMock.mock.calls[0]?.[2]).toBe(true);
    });
  });
});
