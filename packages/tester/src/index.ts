import type { Config } from '@jest/types';

import { setMode } from '@rockpack/utils';

import type { TesterOptions } from './default-props.js';

import { init } from './core/init.js';

export type { TesterOptions };

const tester = (opts: Partial<TesterOptions> = {}, projectConfig: Partial<Config.InitialOptions> = {}): void => {
  setMode(['development', 'production', 'test'], 'test');

  const options = typeof opts.watch === 'boolean' ? opts : { ...opts, watch: process.argv.includes('--watch') };

  init(options, projectConfig).catch(console.error);
};

export { tester };
