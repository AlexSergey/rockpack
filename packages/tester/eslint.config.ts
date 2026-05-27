import { makeConfig } from '@rockpack/codestyle';
import { globalIgnores } from 'eslint/config';

const config = makeConfig();

config.push({
  rules: {
    'no-console': 'off',
    'package-json/require-type': 'off',
  },
});

config.push(globalIgnores(['./examples']));

export default config;
