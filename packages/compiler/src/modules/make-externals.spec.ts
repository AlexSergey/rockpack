import nodeExternals from 'webpack-node-externals';

import { getNodeModules } from '../utils/get-node-modules.js';
import { makeExternals } from './make-externals.js';

jest.mock('webpack-node-externals', () => jest.fn(() => 'node-externals'));
jest.mock('../utils/get-node-modules.js', () => ({ getNodeModules: jest.fn(() => ['/repo/node_modules']) }));

const nodeExternalsMock = nodeExternals as unknown as jest.Mock;

describe('makeExternals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('has no externals for the frontend', () => {
      expect(makeExternals({}, '/repo/app')).toEqual([]);
      expect(nodeExternalsMock).not.toHaveBeenCalled();
    });

    it('bundles node_modules for an isomorphic backend', () => {
      expect(makeExternals({ __isBackend: true, __isIsomorphicBackend: true }, '/repo/app')).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('keeps node_modules external for a backend', () => {
      expect(makeExternals({ __isBackend: true }, '/repo/app')).toBe('node-externals');
      expect(getNodeModules).toHaveBeenCalledWith('/repo/app');
      expect(nodeExternalsMock).toHaveBeenCalledWith({ additionalModuleDirs: ['/repo/node_modules'] });
    });
  });
});
