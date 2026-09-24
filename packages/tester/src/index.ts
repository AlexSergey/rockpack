import type { Config } from '@jest/types';

import { setMode } from '@rockpack/utils';

import type { TesterOptions } from './default-props.js';

import { init } from './core/init.js';

export type { TesterOptions };

const tester = (opts: Partial<TesterOptions> = {}, projectConfig: Partial<Config.InitialOptions> = {}): void => {
  setMode(['development', 'production', 'test'], 'test');

  const args = process.argv.slice(2);
  const positional = args.filter((arg) => !arg.startsWith('-'));
  const options = {
    ...opts,
    ...(typeof opts.watch === 'boolean' ? {} : { watch: args.includes('--watch') }),
    ...(opts.testPathPatterns === undefined && positional.length > 0 ? { testPathPatterns: positional } : {}),
  };

  init(options, projectConfig).catch(console.error);
};

export { tester };
