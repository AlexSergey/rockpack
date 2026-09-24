import type { InternalCompilerConf, Mode } from '../types.js';
import type { Rules } from './rules/types.js';

import { Collection } from '../utils/collection.js';
import { makeAssetRules } from './rules/assets.js';
import { makeMiscRules } from './rules/misc.js';
import { makeScriptRules } from './rules/scripts.js';
import { makeStyleRules } from './rules/styles.js';

// The rules keyed by name in alphabetical order, the order webpack receives them in.
export const makeModules = (
  conf: Partial<InternalCompilerConf>,
  root: string,
  mode: Mode,
  excludeModules: readonly string[] = [],
): Collection => {
  const ctx = { conf, mode, root };
  const rules: Rules = {
    ...makeAssetRules(ctx),
    ...makeMiscRules(),
    ...makeScriptRules(ctx),
    ...makeStyleRules(ctx),
  };
  const data = Object.fromEntries(
    Object.keys(rules)
      .filter((key) => !excludeModules.includes(key))
      .sort()
      .map((key) => [key, rules[key]]),
  );

  return new Collection({ data, props: {} });
};
