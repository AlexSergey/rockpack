import { makeConfig } from '@rockpack/codestyle';

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
    'package-json/valid-description': 'off',
  },
});

export default config;
