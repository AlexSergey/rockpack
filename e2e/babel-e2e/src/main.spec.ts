import createBabelPresets from '@rockpack/babel';

describe('babel preset generator', () => {
  it('generates config with babel preset', () => {
    // eslint-disable-next-line
    const conf: any = createBabelPresets({
      framework: 'none',
      isNodejs: false,
      isomorphic: false,
      isTest: false,
      modules: false,
      presetsAdditionalOptions: {},
      typescript: false,
    });

    expect(conf.presets[0][0].indexOf('@babel/preset-env') > 0).toBe(true);

    expect(conf.plugins[0][0].indexOf('babel-plugin-react-compiler') > 0).toBe(false);
    expect(conf.env.production.plugins).toBeUndefined();
  });

  it('generates config with react framework', () => {
    // eslint-disable-next-line
    const conf: any = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isomorphic: false,
      isTest: false,
      modules: false,
      presetsAdditionalOptions: {},
      typescript: false,
    });

    expect(conf.plugins[0][0].indexOf('babel-plugin-react-compiler') > 0).toBe(true);
    expect(conf.env.production.plugins[0].indexOf('@babel/plugin-transform-react-constant-elements') > 0).toBe(true);
    expect(conf.presets[1][0].indexOf('@babel/preset-react') > 0).toBe(true);
  });

  it('generates config with typescript preset', () => {
    // eslint-disable-next-line
    const conf: any = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isomorphic: false,
      isTest: false,
      modules: false,
      presetsAdditionalOptions: {},
      typescript: true,
    });

    expect(conf.presets[0][0].indexOf('@babel/preset-typescript') > 0).toBe(true);
  });

  it('generates config with isomorphic preset', () => {
    // eslint-disable-next-line
    const conf: any = createBabelPresets({
      framework: 'react',
      isNodejs: false,
      isomorphic: true,
      isTest: false,
      modules: false,
      presetsAdditionalOptions: {},
      typescript: true,
    });

    expect(conf.presets[0][0].indexOf('@babel/preset-typescript') > 0).toBe(true);
  });
});
