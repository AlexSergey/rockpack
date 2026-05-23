import { setMode } from '@rockpack/utils';

import type { TesterOptions } from './default-props';

import { init } from './core/init';

export type { TesterOptions };

const tester = (opts: TesterOptions = {}): void => {
  setMode(['development', 'production', 'test'], 'test');

  init(opts).catch(console.error);
};

export { tester };
