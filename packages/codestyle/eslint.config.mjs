import { makeConfig } from './lib/esm/index.mjs';

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

export default config;
