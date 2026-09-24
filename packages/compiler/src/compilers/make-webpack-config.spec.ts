import { setMode } from '@rockpack/utils';

import { compile } from '../core/compile.js';
import { makeWebpackConfig } from './make-webpack-config.js';

jest.mock('@rockpack/utils', () => ({ setMode: jest.fn() }));
jest.mock('../core/compile.js', () => ({ compile: jest.fn() }));

describe('makeWebpackConfig', () => {
  beforeEach(() => {
    (compile as jest.Mock).mockResolvedValue({ conf: {}, webpackConfig: { mode: 'production' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('never runs webpack', async () => {
      await makeWebpackConfig();

      expect(compile).toHaveBeenCalledWith({}, null, true);
    });
  });

  describe('positive cases', () => {
    it('returns the webpack config for the options and post hook', async () => {
      const post = jest.fn();

      await expect(makeWebpackConfig({ src: 'src/app.ts' }, post)).resolves.toEqual({ mode: 'production' });
      expect(setMode).toHaveBeenCalledWith(['development', 'production'], 'development');
      expect(compile).toHaveBeenCalledWith({ src: 'src/app.ts' }, post, true);
    });
  });
});
