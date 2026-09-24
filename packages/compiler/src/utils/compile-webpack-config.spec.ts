import { Collection } from './collection.js';
import { compileWebpackConfig } from './compile-webpack-config.js';

const createCollection = (items: Record<string, unknown>): Collection => new Collection({ data: items, props: {} });

describe('compileWebpackConfig', () => {
  describe('negative cases', () => {
    it('adds no module rules or plugins without collections', () => {
      expect(compileWebpackConfig({ mode: 'production' }, {}, 'production', '/root', null, null)).toEqual({
        mode: 'production',
      });
    });
  });

  describe('positive cases', () => {
    it('turns the collections into module rules and plugins', () => {
      const modules = createCollection({ js: { test: 'js' } });
      const plugins = createCollection({ define: { name: 'define' } });

      expect(compileWebpackConfig({ mode: 'development' }, {}, 'development', '/root', modules, plugins)).toEqual({
        mode: 'development',
        module: { rules: [{ test: 'js' }] },
        plugins: [{ name: 'define' }],
      });
    });

    it('does not mutate the final config', () => {
      const finalConfig = { mode: 'production' };

      compileWebpackConfig(finalConfig, {}, 'production', '/root', createCollection({}), createCollection({}));

      expect(finalConfig).toEqual({ mode: 'production' });
    });
  });
});
