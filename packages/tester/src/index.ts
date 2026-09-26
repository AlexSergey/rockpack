import type { Config } from '@jest/types';

import { setMode } from '@rockpack/utils';

import type { TestResults } from './core/init.js';
import type { CoverageOptions, TesterOptions } from './default-props.js';

import { init } from './core/init.js';
import { readTestPathPatterns } from './modules/read-test-path-patterns.js';

export type { CoverageOptions, TesterOptions, TestResults };

// Runs the tests and resolves to jest's results (undefined when jest could not run); a failure sets
// process.exitCode to 1, so scripts that do not await still exit with an error.
const tester = (
  opts: Partial<TesterOptions> = {},
  projectConfig: Partial<Config.InitialOptions> = {},
): Promise<TestResults | undefined> => {
  setMode(['development', 'production', 'test'], 'test');

  const args = process.argv.slice(2);
  const positional = readTestPathPatterns(args);
  const options = {
    ...opts,
    ...(typeof opts.watch === 'boolean' ? {} : { watch: args.includes('--watch') }),
    ...(opts.testPathPatterns === undefined && positional.length > 0 ? { testPathPatterns: positional } : {}),
  };

  return init(options, projectConfig);
};

export { tester };
