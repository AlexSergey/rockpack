import { getMode } from '@rockpack/utils';

import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { addArgs } from './args.js';
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
jest.mock('./args.js', () => ({ addArgs: jest.fn() }));
jest.mock('./inner-props.js', () => ({ innerProps: jest.fn() }));
jest.mock('./make.js', () => ({ make: jest.fn() }));
jest.mock('./run.js', () => ({ run: jest.fn() }));

const conf = { dist: 'dist/index.js', src: 'src/index.ts' } as InternalCompilerConf;
const finalConf = { ...conf, messages: [] } as InternalCompilerConf;
const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };
const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };

describe('compile', () => {
  beforeEach(() => {
    (getMode as jest.Mock).mockReturnValue('production');
    (mergeConfWithDefault as jest.Mock).mockResolvedValue({ ...conf, merged: true });
    (innerProps as jest.Mock).mockImplementation((value: object) => ({ ...value, inner: true }));
    (addArgs as jest.Mock).mockImplementation((value: object) => ({ ...value, args: true }));
    (make as jest.Mock).mockResolvedValue({ conf: finalConf, webpackConfig: { mode: 'production' } });
    (run as jest.Mock).mockReturnValue('run result');
  });

  afterEach(() => {
    setLegacyIsomorphicContext(undefined);
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('returns only the config when asked not to run', async () => {
      await expect(compile(conf, null, true)).resolves.toEqual({
        conf: finalConf,
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
      setLegacyIsomorphicContext(ISOMORPHIC_CONTEXT);
      await pending;

      expect(innerProps).toHaveBeenCalledWith(expect.anything(), 'production', ISOMORPHIC_CONTEXT);
      expect(run).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('merges defaults, inner props and args before making the config', async () => {
      const post = jest.fn();

      await compile(conf, post);

      expect(mergeConfWithDefault).toHaveBeenCalledWith(conf, 'production');
      expect(innerProps).toHaveBeenCalledWith(
        expect.objectContaining({ merged: true }),
        'production',
        STANDALONE_CONTEXT,
      );
      expect(make).toHaveBeenCalledWith(
        expect.objectContaining({ args: true, inner: true, merged: true }),
        post,
        STANDALONE_CONTEXT,
      );
    });

    it('runs webpack with the made config', async () => {
      await expect(compile(conf, null)).resolves.toBe('run result');
      expect(run).toHaveBeenCalledWith({ mode: 'production' }, 'production', 'webpack', finalConf);
    });

    it('lets an explicit context override the config-only argument', async () => {
      await compile(conf, null, true, STANDALONE_CONTEXT);

      expect(run).toHaveBeenCalled();
    });
  });
});
