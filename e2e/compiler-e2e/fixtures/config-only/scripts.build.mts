import { makeWebpackConfig } from '@rockpack/compiler';

void makeWebpackConfig({}, (finalConfig, modules, plugins, mode) => {
  finalConfig.resolve ??= {};
  finalConfig.resolve.alias = { custom: './src' };
  plugins.set('CustomPlugin', { apply: () => undefined });
  console.log(JSON.stringify({ hasModules: typeof modules.get === 'function', mode }));
}).then((config) => {
  console.log(
    JSON.stringify({
      alias: config.resolve?.alias,
      entry: Object.keys(config.entry as Record<string, unknown>),
      mode: config.mode,
      plugins: (config.plugins ?? []).length,
    }),
  );
});
