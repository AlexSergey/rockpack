import { parseTscOutput } from './parse-tsc-output.js';

describe('parseTscOutput', () => {
  describe('negative cases', () => {
    it('returns no issues for a clean run', () => {
      expect(parseTscOutput('')).toEqual([]);
    });

    it('ignores lines that are not errors and indented lines before any error', () => {
      expect(parseTscOutput('  stray continuation\nVersion 6.0.3\nsrc/a.ts(1,1): warning TS1: ignored\n')).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('reads errors with their file and position', () => {
      expect(
        parseTscOutput(
          "src/a.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.\n" +
            "src/b.tsx(3,10): error TS2304: Cannot find name 'x'.\n",
        ),
      ).toEqual([
        {
          code: 'TS2322',
          column: 14,
          file: 'src/a.ts',
          line: 1,
          message: "Type 'string' is not assignable to type 'number'.",
        },
        { code: 'TS2304', column: 10, file: 'src/b.tsx', line: 3, message: "Cannot find name 'x'." },
      ]);
    });

    it('appends indented lines to the error above', () => {
      expect(
        parseTscOutput(
          "src/a.ts(2,7): error TS2322: Type '{ b: string; }' is not assignable to type 'A'.\r\n" +
            "  The types of 'b' are incompatible between these types.\r\n" +
            "    Type 'string' is not assignable to type 'number'.\r\n",
        ),
      ).toEqual([
        {
          code: 'TS2322',
          column: 7,
          file: 'src/a.ts',
          line: 2,
          message:
            "Type '{ b: string; }' is not assignable to type 'A'.\n" +
            "  The types of 'b' are incompatible between these types.\n" +
            "    Type 'string' is not assignable to type 'number'.",
        },
      ]);
    });

    it('reads errors without a file', () => {
      expect(
        parseTscOutput(
          "error TS2688: Cannot find type definition file for 'jest'.\n  The file is in the program because:\n",
        ),
      ).toEqual([
        {
          code: 'TS2688',
          message: "Cannot find type definition file for 'jest'.\n  The file is in the program because:",
        },
      ]);
    });
  });
});
