const { makeConfig } = require('../index');

test('Codestyle basic config rules overriding', async () => {
  //process.env.NODE_ENV = 'production';
  const eslintConf = makeConfig({
    'no-console': 'error'
  });
  expect(eslintConf.rules['no-console']).toBe('error');
});

test('Codestyle basic config rules overriding for TS', async () => {
  //process.env.NODE_ENV = 'production';
  const eslintConf = makeConfig({
    'no-console': 'error'
  });
  expect(eslintConf.overrides[0].rules['no-console'])
    .toBe('error');
});

test('Check NODE_ENV = production for some rules', async () => {
  process.env.NODE_ENV = 'production';
  const eslintConf = makeConfig();

  expect(eslintConf.rules['no-console'])
    .toBe('error');
  expect(eslintConf.rules['no-alert'])
    .toBe('error');
  expect(eslintConf.rules['no-debugger'])
    .toBe('error');
});

test('Codestyle overriding with NODE_ENV = production for some rules', async () => {
  process.env.NODE_ENV = 'production';
  const eslintConf = makeConfig({
    'no-console': 'off',
    'no-alert': 'off',
  });

  expect(eslintConf.rules['no-console'])
    .toBe('off');
  expect(eslintConf.rules['no-debugger'])
    .toBe('error');
  expect(eslintConf.rules['no-alert'])
    .toBe('off');
});

test('Codestyle overriding by global config', async () => {
  process.env.NODE_ENV = 'production';
  const eslintConf = makeConfig(null, {
    rules: {
      quotes: 'off'
    }
  });

  expect(eslintConf.rules.quotes)
    .toBe('off');
});
