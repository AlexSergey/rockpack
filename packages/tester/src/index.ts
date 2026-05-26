import type { Config } from '@jest/types';

import { setMode } from '@rockpack/utils';

import type { TesterOptions } from './default-props.js';

import { init } from './core/init.js';

export type { TesterOptions };

const tester = (opts: Partial<TesterOptions> = {}, projectConfig: Partial<Config.InitialOptions> = {}): void => {
  setMode(['development', 'production', 'test'], 'test');

  init(opts, projectConfig).catch(console.error);
};

export { tester };
