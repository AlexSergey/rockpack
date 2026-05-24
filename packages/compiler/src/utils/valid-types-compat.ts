import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

// valid-types ships only a UMD CJS bundle with no "exports" field, so named
// ESM imports fail at runtime. Load it via createRequire so both the ESM and
// CJS compiler outputs resolve it correctly.
type Predicate = (val: unknown) => boolean;
const vt = _require('valid-types') as Record<string, Predicate>;

export const isArray: Predicate = vt['isArray']!;
export const isBoolean: Predicate = vt['isBoolean']!;
export const isDefined: Predicate = vt['isDefined']!;
export const isEmpty: Predicate = vt['isEmpty']!;
export const isFunction: Predicate = vt['isFunction']!;
export const isNull: Predicate = vt['isNull']!;
export const isNumber: Predicate = vt['isNumber']!;
export const isObject: Predicate = vt['isObject']!;
export const isString: Predicate = vt['isString']!;
export const isUndefined: Predicate = vt['isUndefined']!;
