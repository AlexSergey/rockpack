import { backendCompiler } from '@rockpack/compiler';
import path from 'node:path';

void backendCompiler({}, (finalConfig) => {
  finalConfig.resolve ??= {};
  Object.assign(finalConfig.resolve, {
    alias: {
      text: path.resolve('./text'),
    },
  });
});
