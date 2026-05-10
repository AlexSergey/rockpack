import { makeConfig } from '@rockpack/codestyle';

const config = makeConfig();

config.push({
  ignores: ['**/global.declaration.ts'],
  rules: {
    'package-json/require-type': 'off',
  },
});

export default config;
