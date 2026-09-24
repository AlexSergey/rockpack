import { makeConfig } from '@rockpack/codestyle';
import { globalIgnores } from 'eslint/config';

const config = makeConfig();

config.push(globalIgnores(['./fixtures', './.out']));

export default config;
