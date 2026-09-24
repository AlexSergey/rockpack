import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { compile } from '../core/compile.js';
import { libraryCompiler } from './library-compiler.js';

jest.mock('@rockpack/utils', () => ({ setMode: jest.fn() }));
jest.mock('../core/compile.js', () => ({ compile: jest.fn(() => Promise.resolve('compiled')) }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

const compileMock = compile as jest.MockedFunction<typeof compile>;
const compiledConf = (): Record<string, unknown> => compileMock.mock.calls[0]?.[0] as Record<string, unknown>;

describe('libraryCompiler', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('exits for options that are neither a name nor an object with a name', async () => {
      await expect(libraryCompiler({ esm: { dist: 'lib', src: 'src' } } as never)).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith(
        'Object is not correct. You should set { name: String, esm?:{ src: String, dist: String }, cjs?:{ src: String, dist: String } }',
      );
      expect(compile).not.toHaveBeenCalled();
    });

    it('ignores empty externals', async () => {
      await libraryCompiler({ externals: [], name: 'MyLib' });

      expect(compiledConf()).not.toHaveProperty('externals');
    });
  });

  describe('positive cases', () => {
    it('builds a library from a name', async () => {
      await expect(libraryCompiler('MyLib', { src: 'src/index.ts' })).resolves.toBe('compiled');

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
      await libraryCompiler('MyLib', { html: { title: 'Demo' } });

      expect(compiledConf()['html']).toEqual({ title: 'Demo' });
    });

    it('builds a node library as a backend without html', async () => {
      await libraryCompiler('MyLib', { html: true, nodejs: true } as never, undefined, true);

      expect(compiledConf()).toMatchObject({ __isBackend: true, html: false, nodejs: true });
      expect(compileMock.mock.calls[0]?.[2]).toBe(true);
    });
  });
});
