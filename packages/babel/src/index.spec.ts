import type { PluginItem } from '@babel/core';

import { createBabelPresets } from './index';

const hasPlugin = (plugins: null | PluginItem[] | undefined, name: string): boolean =>
  (plugins ?? []).some((plugin) => typeof plugin === 'string' && plugin.includes(name));

describe('createBabelPresets', () => {
  describe('negative cases', () => {
    it('does not add test-only transforms outside of test mode', () => {
      const { plugins } = createBabelPresets();

      expect(hasPlugin(plugins, 'babel-plugin-transform-import-meta')).toBe(false);
      expect(hasPlugin(plugins, 'plugin-transform-modules-commonjs')).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('transforms import.meta and ES modules in test mode', () => {
      const { plugins } = createBabelPresets({ isTest: true });

      expect(hasPlugin(plugins, 'babel-plugin-transform-import-meta')).toBe(true);
      expect(hasPlugin(plugins, 'plugin-transform-modules-commonjs')).toBe(true);
    });
  });
});
