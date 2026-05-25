import type { Config } from '@jest/types';

import { setMode } from '@rockpack/utils';

import type { TesterOptions } from './default-props.js';

import { init } from './core/init.js';

export type { TesterOptions };

const tester = (opts: TesterOptions = {}, projectConfig: Config.ProjectConfig): void => {
  setMode(['development', 'production', 'test'], 'test');

  init(opts, projectConfig).catch(console.error);
};

export { tester };
