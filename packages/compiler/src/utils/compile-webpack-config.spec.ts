import { Collection } from './collection.js';
import { compileWebpackConfig } from './compile-webpack-config.js';

const createCollection = <T>(items: Record<string, T>): Collection<T> => new Collection(items);

describe('compileWebpackConfig', () => {
  describe('negative cases', () => {
    it('adds no module rules or plugins without collections', () => {
      expect(compileWebpackConfig({ mode: 'production' }, null, null)).toEqual({
        mode: 'production',
      });
    });
  });

  describe('positive cases', () => {
    it('turns the collections into module rules and plugins', () => {
      const modules = createCollection({ js: { test: 'js' } });
      const define = { apply: (): void => undefined, name: 'define' };
      const plugins = createCollection({ define });

      expect(compileWebpackConfig({ mode: 'development' }, modules, plugins)).toEqual({
        mode: 'development',
        module: { rules: [{ test: 'js' }] },
        plugins: [define],
      });
    });

    it('does not mutate the final config', () => {
      const finalConfig = { mode: 'production' };

      compileWebpackConfig(finalConfig, createCollection({}), createCollection({}));

      expect(finalConfig).toEqual({ mode: 'production' });
    });
  });
});
