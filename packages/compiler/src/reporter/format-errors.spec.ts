import { fromError, fromStatsProblem, fromTypeScriptIssue, uniqueProblems } from './format-errors.js';

const root = '/project';

// Messages recorded from real builds of a probe project (paths replaced with /project).
const RECORDED = {
  babel:
    'Module build failed (from ../node_modules/babel-loader/lib/index.js):\n' +
    'SyntaxError: /project/src/index.ts: Unexpected token (2:10)\n\n' +
    "  1 | import './styles.css';\n> 2 | const a = ;\n    |           ^\n  3 | export { a };\n" +
    '    at constructor (/project/node_modules/@babel/parser/lib/index.js:367:19)',
  css:
    'Module build failed (from ../node_modules/postcss-loader/dist/cjs.js):\n\nSyntaxError\n\n' +
    '(1:1) /project/src/bad.css Unclosed block\n\n> 1 | a {\n    | ^',
  cssWrapper:
    'Module build failed (from ../node_modules/mini-css-extract-plugin/dist/loader.js):\n' +
    'HookWebpackError: Module build failed (from ../node_modules/postcss-loader/dist/cjs.js):',
  eslint:
    '[eslint] \n/project/src/index.ts\n  5:1  error  Unexpected var, use let or const instead  no-var\n\n✖ 1 problem',
  missing: "Module not found: Error: Can't resolve './missing' in '/project/src'",
  stylelint:
    '[stylelint] \nsrc/styles.css\n  2:10  ✖  Disallowed named color "red"  color-named\n\n✖ 1 problem (1 error, 0 warnings)',
  typescript: "TS2322: Type 'string' is not assignable to type 'number'.\n  > 5 | var legacy: number = 'text';",
};

describe('format-errors', () => {
  describe('negative cases', () => {
    it('drops the mini-css-extract wrapper of a style error', () => {
      expect(fromStatsProblem({ message: RECORDED.cssWrapper, moduleName: './src/bad.css' }, root)).toEqual([]);
    });

    it('removes trailing spaces from every line', () => {
      const [problem] = fromStatsProblem({ message: 'performance recommendations:  \nAssets:   \n  index.js' }, root);

      expect(problem?.message).toBe('performance recommendations:\nAssets:\n  index.js');
    });

    it('removes stack frames, colour codes and the project root', () => {
      const [problem] = fromStatsProblem(
        { message: '\u001B[31mSomething failed in /project/src/a.ts\u001B[39m\n    at run (/project/x.js:1:1)' },
        root,
      );

      expect(problem?.message).toBe('Something failed in src/a.ts');
    });

    it('keeps the first twelve lines of a long message', () => {
      const [problem] = fromStatsProblem(
        { message: Array.from({ length: 20 }, (_, i) => `line ${String(i)}`).join('\n') },
        root,
      );

      expect(problem?.message.split('\n')).toHaveLength(13);
      expect(problem?.message.endsWith('…')).toBe(true);
    });

    it('keeps one of the problems both isomorphic compilers report', () => {
      const problem = { kind: 'TypeScript', location: 'src/a.ts:1:1', message: 'TS1: x' } as const;

      expect(uniqueProblems([problem, problem, { ...problem, location: 'src/b.ts:1:1' }])).toHaveLength(2);
    });
  });

  describe('positive cases', () => {
    it('reads a Babel syntax error with its code frame', () => {
      expect(fromStatsProblem({ message: RECORDED.babel, moduleName: './src/index.ts' }, root)).toEqual([
        {
          kind: 'Syntax',
          location: 'src/index.ts',
          message:
            "Unexpected token (2:10)\n\n  1 | import './styles.css';\n> 2 | const a = ;\n    |           ^\n  3 | export { a };",
        },
      ]);
    });

    it('reads a missing module with the importing file and line', () => {
      expect(
        fromStatsProblem({ loc: '3:0-36', message: RECORDED.missing, moduleName: './src/index.ts' }, root),
      ).toEqual([
        { kind: 'Module not found', location: 'src/index.ts:3', message: "Can't resolve './missing' in 'src'" },
      ]);
    });

    it('reads a TypeScript error with its position', () => {
      expect(fromStatsProblem({ file: './src/index.ts:5:5', message: RECORDED.typescript }, root)).toEqual([
        { kind: 'TypeScript', location: 'src/index.ts:5:5', message: RECORDED.typescript },
      ]);
    });

    it('reads a style build error from the file of the loader chain', () => {
      const [problem] = fromStatsProblem(
        {
          message: RECORDED.css,
          moduleName: './src/bad.css.webpack[javascript/auto]!=!../node_modules/css-loader!./src/bad.css',
        },
        root,
      );

      expect(problem).toMatchObject({ kind: 'CSS', location: 'src/bad.css' });
      expect(problem?.message).toContain('src/bad.css Unclosed block');
    });

    it('reads the ESLint and Stylelint reports', () => {
      expect(fromError(new Error(RECORDED.eslint), root)).toEqual([
        {
          kind: 'ESLint',
          message: 'src/index.ts\n  5:1  error  Unexpected var, use let or const instead  no-var\n\n✖ 1 problem',
        },
      ]);
      expect(fromStatsProblem({ message: RECORDED.stylelint }, root)[0]).toMatchObject({ kind: 'Stylelint' });
    });

    it('reads a tsc error with its position', () => {
      expect(
        fromTypeScriptIssue(
          { code: 'TS2339', column: 5, file: '/project/src/app.tsx', line: 12, message: 'No title.' },
          root,
        ),
      ).toEqual({ kind: 'TypeScript', location: 'src/app.tsx:12:5', message: 'TS2339: No title.' });
      expect(fromTypeScriptIssue({ code: 'TS2339', file: 'src/app.tsx', message: 'No title.' }, root)).toEqual({
        kind: 'TypeScript',
        location: 'src/app.tsx',
        message: 'TS2339: No title.',
      });
      expect(fromTypeScriptIssue({ code: 'TS6053', message: 'File not found.' }, root)).toEqual({
        kind: 'TypeScript',
        message: 'TS6053: File not found.',
      });
    });

    it('falls back to a build problem with the module location', () => {
      expect(fromStatsProblem({ loc: '4:2', message: 'Unexpected thing', moduleName: './src/x.ts' }, root)).toEqual([
        { kind: 'Build', location: 'src/x.ts:4', message: 'Unexpected thing' },
      ]);
    });
  });
});
