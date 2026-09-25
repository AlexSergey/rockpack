import { isRecord, isString } from '@rockpack/utils';

import type { InternalCompilerConf } from '../types.js';

import { RockpackError } from '../errors/rockpack-error.js';

type Check = (value: unknown, path: string) => string[];

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const expect =
  (guard: (value: unknown) => boolean, expected: string): Check =>
  (value, path) =>
    guard(value) ? [] : [`${path} must be ${expected}`];

const optional =
  (check: Check): Check =>
  (value, path) =>
    value === undefined ? [] : check(value, path);

const string = expect(isString, 'a string');
const boolean = expect(isBoolean, 'a boolean');
const stringOrNull = expect((value) => value === null || isString(value), 'a string or null');

const fields =
  (shape: Readonly<Record<string, Check>>, expected: string): Check =>
  (value, path) =>
    isRecord(value)
      ? Object.entries(shape).flatMap(([key, check]) => check(value[key], `${path}.${key}`))
      : [`${path} must be ${expected}`];

const list =
  (check: Check): Check =>
  (value, path) =>
    Array.isArray(value)
      ? value.flatMap((item, index) => check(item, `${path}[${index}]`))
      : [`${path} must be an array`];

const htmlPage = fields(
  {
    code: optional(stringOrNull),
    favicon: optional(stringOrNull),
    filename: optional(expect((value) => value === false || isString(value), 'false or a string')),
    template: optional(string),
    title: optional(string),
  },
  'an object',
);

const copySpec = fields({ from: string, to: string }, 'an object with from and to');

const copyFiles = fields({ files: list(copySpec) }, 'an object with files');

const format = fields({ dist: string, src: string }, 'an object with src and dist');

const CHECKS: Readonly<Record<string, Check>> = {
  analyzer: optional(boolean),
  banner: optional(expect((value) => isBoolean(value) || isString(value), 'a boolean or a string')),
  cache: optional(boolean),
  cjs: optional(format),
  copy: optional((value, path) => {
    if (Array.isArray(value)) {
      return list(copySpec)(value, path);
    }

    return isRecord(value) && 'files' in value ? copyFiles(value, path) : copySpec(value, path);
  }),
  debug: optional(boolean),
  dist: optional(string),
  esm: optional(format),
  global: optional((value, path) =>
    isRecord(value)
      ? Object.entries(value).flatMap(([key, item]) => string(item, `${path}.${key}`))
      : [`${path} must be an object`],
  ),
  html: optional((value, path) => {
    if (isBoolean(value)) {
      return [];
    }

    return Array.isArray(value) ? list(htmlPage)(value, path) : htmlPage(value, path);
  }),
  ignore: optional(list(string)),
  lint: optional(boolean),
  port: optional(expect((value) => Number.isInteger(value) && Number(value) > 0, 'a positive integer')),
  styles: optional(expect((value) => value === false || isString(value), 'false or a string')),
  types: optional(string),
  vendor: optional(list(string)),
  version: optional(string),
};

// Every problem in the compiler options, each naming the option path; a bad `src` is an INVALID_ENTRY.
export const validateConf = (conf: Partial<InternalCompilerConf>): RockpackError[] => {
  const options = conf as Record<string, unknown>;
  const entry = string(options['src'], 'src').map((message) => new RockpackError('INVALID_ENTRY', message));
  const others = Object.entries(CHECKS).flatMap(([key, check]) =>
    check(options[key], key).map((message) => new RockpackError('INVALID_CONFIG', message)),
  );

  return [...entry, ...others];
};

// Throws the problems validateConf finds as one RockpackError listing them all.
export const assertValidConf = (conf: Partial<InternalCompilerConf>): void => {
  const [first, ...rest] = validateConf(conf);
  if (first === undefined) {
    return;
  }
  if (rest.length === 0) {
    throw first;
  }
  throw new RockpackError(first.code, [first, ...rest].map((problem) => problem.message).join('; '));
};
