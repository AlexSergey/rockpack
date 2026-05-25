import type { Config } from '@jest/types';

import { runCLI } from 'jest';

import type { TesterOptions } from '../default-props.js';

import { configCompiler } from '../configs/config-compiler.js';

export const init = async (opts: TesterOptions = {}, projectConfig: Config.ProjectConfig): Promise<void> => {
  const jestConfig = configCompiler(opts, projectConfig);

  try {
    const { results } = await runCLI(jestConfig as Parameters<typeof runCLI>[0], [process.cwd()]);

    if (results.success) {
      console.log('✅ All tests have passed successfully!');
    } else {
      console.error('❌ Some tests have failed!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Jest encountered an error:', err);
    process.exit(1);
  }
};
