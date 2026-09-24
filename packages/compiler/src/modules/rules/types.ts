import type { RuleSetRule } from 'webpack';

import type { InternalCompilerConf, Mode } from '../../types.js';

export type RuleContext = {
  readonly conf: Partial<InternalCompilerConf>;
  readonly mode: Mode;
  readonly root: string;
};

export type Rules = Record<string, RuleSetRule>;
