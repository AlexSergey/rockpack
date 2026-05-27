import { makeConfig } from './src';

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

export default config;
