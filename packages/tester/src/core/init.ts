import { runCLI } from 'jest';

import type { TesterOptions } from '../default-props';

import { configCompiler } from '../configs/config-compiler';

export const init = async (opts: TesterOptions = {}): Promise<void> => {
  const jestConfig = configCompiler(opts);

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
