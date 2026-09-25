import type { Config } from '@jest/types';

import { runCLI } from 'jest';

import type { TesterOptions } from '../default-props.js';

import { configCompiler } from '../configs/config-compiler.js';
import { supportsEsm } from './supports-esm.js';

export type TestResults = Awaited<ReturnType<typeof runCLI>>['results'];

// Runs jest and reports the outcome through process.exitCode; the process is never exited here, so callers can
// await the results and decide themselves. Resolves to undefined when jest could not run at all.
export const init = async (
  opts: Partial<TesterOptions> = {},
  projectConfig: Partial<Config.InitialOptions> = {},
): Promise<TestResults | undefined> => {
  if (opts.esm && !supportsEsm()) {
    console.error(
      'esm: true runs the specs as ES modules, which Jest supports only with Node.js --experimental-vm-modules.\n' +
        'Run the tests with: node --experimental-vm-modules scripts.tests.mts',
    );
    process.exitCode = 1;

    return undefined;
  }

  try {
    const { argv } = configCompiler(opts, projectConfig);
    const { results } = await runCLI(argv as Parameters<typeof runCLI>[0], [process.cwd()]);

    if (results.success) {
      console.log('✅ All tests have passed successfully!');
    } else {
      console.error('❌ Some tests have failed!');
      process.exitCode = 1;
    }

    return results;
  } catch (err) {
    console.error('Jest encountered an error:', err);
    process.exitCode = 1;

    return undefined;
  }
};
