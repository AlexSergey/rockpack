import { createBabelPresets } from '@rockpack/babel';

interface Config {
  babelrc: boolean;
  env: {
    production: {
      plugins: string[];
    };
  };
  plugins: string[][];
  presets: string[][];
}

describe('babel preset generator', () => {
  it('generates config with babel preset', () => {
    const conf = createBabelPresets({
      framework: 'none',
      isNodejs: false,
      isTest: false,
      modules: false,
      typescript: false,
    }) as unknown as Config;

    const preset = conf.presets?.[0]?.[0] as string;

    expect(typeof preset === 'string' && preset.includes('@babel/preset-env')).toBe(true);
    expect(typeof preset === 'string' && preset.includes('babel-plugin-react-compiler')).toBe(false);

    expect(conf.env.production.plugins).toBeUndefined();
  });

  it('generates config with react framework', () => {
    const conf = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isTest: false,
      modules: false,
      typescript: false,
    }) as unknown as Config;
    const pluginsGlobal = conf.plugins?.[0]?.[0] as string;
    const preset2 = conf.presets?.[1]?.[0] as string;
    const plugins = conf.env.production.plugins[0] as string;

    expect(pluginsGlobal.includes('babel-plugin-react-compiler')).toBe(true);

    expect(plugins.includes('@babel/plugin-transform-react-constant-elements')).toBe(true);

    expect(plugins.includes('@babel/plugin-transform-react-constant-elements')).toBe(true);

    expect(preset2.includes('@babel/preset-react')).toBe(true);
  });

  it('generates config with typescript preset', () => {
    const conf: Config = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isTest: false,
      modules: false,
      typescript: true,
    }) as unknown as Config;

    const preset = conf.presets?.[0]?.[0] as string;

    expect(preset.includes('@babel/preset-typescript')).toBe(true);
  });

  it('generates config with isomorphic preset', () => {
    const conf = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isTest: false,
      modules: false,
      typescript: true,
    }) as unknown as Config;

    const preset = conf.presets?.[0]?.[0] as string;

    expect(preset.includes('@babel/preset-typescript')).toBe(true);
  });
});
