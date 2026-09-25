import type { UserConfig } from '@commitlint/types';

import { resolveFromCodestyle } from './resolve.js';

export const commitlintConfig: UserConfig = {
  extends: [resolveFromCodestyle('@commitlint/config-conventional')],
  rules: {
    'type-enum': [2, 'always', ['ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style']],
  },
};
