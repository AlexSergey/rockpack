import { makeConfig } from '@rockpack/codestyle';
import { globalIgnores } from 'eslint/config';

const config = makeConfig();

config.push({
  rules: {
    'no-console': 'off',
    'package-json/require-type': 'off',
    'package-json/valid-description': 'off',
  },
});

config.push(globalIgnores(['./src/generators']));

export default config;
