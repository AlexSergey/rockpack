import { makeConfig } from '@rockpack/codestyle';

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

export default config;
