import type { TypeScriptIssue } from '../reporter/format-errors.js';

// `src/a.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.`
const LOCATED_ERROR = /^(.+)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
// `error TS2688: Cannot find type definition file for 'jest'.`
const GLOBAL_ERROR = /^error (TS\d+): (.*)$/;

// The errors of `tsc --pretty false`, the same in TypeScript 6 and 7; indented lines continue the error above.
export const parseTscOutput = (output: string): TypeScriptIssue[] => {
  const issues: TypeScriptIssue[] = [];

  for (const line of output.split(/\r?\n/)) {
    const located = LOCATED_ERROR.exec(line);
    const global = GLOBAL_ERROR.exec(line);
    const last = issues.at(-1);

    if (located) {
      const [, file = '', lineNumber = '', column = '', code = '', message = ''] = located;
      issues.push({ code, column: Number(column), file, line: Number(lineNumber), message });
    } else if (global) {
      const [, code = '', message = ''] = global;
      issues.push({ code, message });
    } else if (last && /^\s+\S/.test(line)) {
      issues[issues.length - 1] = { ...last, message: `${last.message}\n${line.trimEnd()}` };
    }
  }

  return issues;
};
