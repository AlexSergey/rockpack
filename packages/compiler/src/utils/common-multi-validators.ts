import type { CompilerConf } from '../types.js';

import { isUndefined } from './valid-types-compat.js';

export function commonMultiValidator(props: CompilerConf[]): void {
  if (props.length === 0) {
    console.error('The config is empty');
    process.exit(1);
  }

  for (const prop of props) {
    if (isUndefined(prop.compilerName)) {
      console.error('The config is invalid');
      process.exit(1);
    }
  }
}
