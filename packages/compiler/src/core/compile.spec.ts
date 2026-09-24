import { getMode } from '@rockpack/utils';

import type { InternalCompilerConf } from '../types.js';

import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { addArgs } from './args.js';
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
    global.CONFIG_ONLY = undefined;
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

    it('lets CONFIG_ONLY=true skip the run', async () => {
      global.CONFIG_ONLY = true;

      await compile(conf, null, false);

      expect(run).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('merges defaults, inner props and args before making the config', async () => {
      const post = jest.fn();

      await compile(conf, post);

      expect(mergeConfWithDefault).toHaveBeenCalledWith(conf, 'production');
      expect(innerProps).toHaveBeenCalledWith(expect.objectContaining({ merged: true }), 'production');
      expect(make).toHaveBeenCalledWith(expect.objectContaining({ args: true, inner: true, merged: true }), post);
    });

    it('runs webpack with the made config', async () => {
      await expect(compile(conf, null)).resolves.toBe('run result');
      expect(run).toHaveBeenCalledWith({ mode: 'production' }, 'production', 'webpack', finalConf);
    });

    it('lets CONFIG_ONLY=false force the run', async () => {
      global.CONFIG_ONLY = false;

      await compile(conf, null, true);

      expect(run).toHaveBeenCalled();
    });
  });
});
