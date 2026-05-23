import { createBabelPresets } from '@rockpack/babel';
import babelJest from 'babel-jest';

const opts = createBabelPresets({
  framework: 'react',
  isTest: true,
});

// eslint-disable-next-line  @import-lite/no-default-export
export default babelJest.createTransformer({ ...opts });
