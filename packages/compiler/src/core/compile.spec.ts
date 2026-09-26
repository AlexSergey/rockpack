import { getMode } from '@rockpack/utils';

import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { RockpackError } from '../errors/rockpack-error.js';
import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { setLegacyIsomorphicContext } from './compile-context.js';
import { compile } from './compile.js';
import { innerProps } from './inner-props.js';
import { make } from './make.js';
import { run } from './run.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
}));
jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('../utils/merge-conf-with-default.js', () => ({ mergeConfWithDefault: jest.fn() }));
jest.mock('./inner-props.js', () => ({ innerProps: jest.fn() }));
jest.mock('./make.js', () => ({ make: jest.fn() }));
jest.mock('./run.js', () => ({ run: jest.fn() }));

const conf = { dist: 'dist/index.js', src: 'src/index.ts' } as InternalCompilerConf;
const finalConf = { ...conf, inner: true } as InternalCompilerConf;
const compiler = {
  close: jest.fn((callback: () => void) => {
    callback();
  }),
};
const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };
const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };

describe('compile', () => {
  beforeEach(() => {
    (getMode as jest.Mock).mockReturnValue('production');
    (mergeConfWithDefault as jest.Mock).mockResolvedValue({ ...conf, merged: true });
    (innerProps as jest.Mock).mockImplementation((value: object) => ({ ...value, inner: true }));
    (make as jest.Mock).mockResolvedValue({ conf: finalConf, webpackConfig: { mode: 'production' } });
    (run as jest.Mock).mockReturnValue({
      compiler,
      finished: Promise.resolve({ stats: 'stats', success: true }),
    });
  });

  afterEach(() => {
    setLegacyIsomorphicContext(undefined);
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('returns only the config when asked not to run', async () => {
      await expect(compile(conf, null, true)).resolves.toEqual({
        conf: finalConf,
        kind: 'config',
        webpackConfig: { mode: 'production' },
      });
      expect(run).not.toHaveBeenCalled();
    });

    it('does not run webpack for a config-only context', async () => {
      await compile(conf, null, false, ISOMORPHIC_CONTEXT);

      expect(run).not.toHaveBeenCalled();
    });

    it('picks up the legacy isomorphic context set after the call started', async () => {
      const pending = compile(conf, null);
      setLegacyIsomorphicContext(Promise.resolve(ISOMORPHIC_CONTEXT));
      await pending;

      expect(innerProps).toHaveBeenCalledWith(expect.anything(), 'production', ISOMORPHIC_CONTEXT);
      expect(run).not.toHaveBeenCalled();
    });

    it('rejects with the error webpack reported when it could not apply the config in development', async () => {
      (getMode as jest.Mock).mockReturnValue('development');
      const error = new RockpackError('BUILD_FAILED', 'Missing environment variable: TOKEN');
      (run as jest.Mock).mockReturnValue({ compiler: null, finished: Promise.reject(error) });

      await expect(compile(conf, null)).rejects.toBe(error);
    });
  });

  describe('positive cases', () => {
    it('reports where the bundle of a dist folder goes', async () => {
      const info = jest.fn();
      (mergeConfWithDefault as jest.Mock).mockResolvedValue({ ...conf, dist: 'build/index.js', merged: true });

      await compile({ ...conf, dist: 'build' }, null, true, {
        configOnly: true,
        isomorphic: false,
        reporter: {
          done: jest.fn(),
          info,
          interactive: false,
          issues: jest.fn(),
          progress: jest.fn(),
          start: jest.fn(),
        },
      });

      expect(info).toHaveBeenCalledWith('build', 'output: build/index.js');
    });

    it('merges defaults and inner props before making the config', async () => {
      const post = jest.fn();

      await compile(conf, post);

      expect(mergeConfWithDefault).toHaveBeenCalledWith(conf, 'production');
      const standalone = {
        ...STANDALONE_CONTEXT,
        reporter: expect.objectContaining({ interactive: false }) as unknown,
      };
      expect(innerProps).toHaveBeenCalledWith(expect.objectContaining({ merged: true }), 'production', standalone);
      expect(make).toHaveBeenCalledWith(expect.objectContaining({ inner: true, merged: true }), post, standalone);
    });

    it('runs a production build to the end and reports its outcome', async () => {
      await expect(compile(conf, null)).resolves.toEqual({ kind: 'build', stats: 'stats', success: true });
      expect(run).toHaveBeenCalledWith(
        { mode: 'production' },
        'production',
        'webpack',
        finalConf,
        expect.objectContaining({ interactive: false }),
      );
    });

    it('returns a watching build in development that closes the compiler when stopped', async () => {
      (getMode as jest.Mock).mockReturnValue('development');

      const result = await compile(conf, null);

      expect(result).toMatchObject({ compiler, conf: finalConf, kind: 'watch' });
      await (result as { stop: () => Promise<void> }).stop();
      expect(compiler.close).toHaveBeenCalled();
    });

    it('lets an explicit context override the config-only argument', async () => {
      await compile(conf, null, true, STANDALONE_CONTEXT);

      expect(run).toHaveBeenCalled();
    });
  });
});
