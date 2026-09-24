// A plain object: `{}`, object literals and `Object.create(null)`, but not arrays, null, dates or class instances
// with their own toStringTag.
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

export const isString = (value: unknown): value is string => typeof value === 'string';
