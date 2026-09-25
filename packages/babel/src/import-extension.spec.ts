import { transformSync } from '@babel/core';
import { execFileSync } from 'node:child_process';
import fs, { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

const _require = createRequire(import.meta.url);
const plugin = _require.resolve('@rockpack/babel/plugins/import-extension');

// A project on disk, so the plugin can tell files, folders and assets apart.
const FILES = [
  'src/no-ext.ts',
  'src/utils/index.ts',
  'src/both.ts',
  'src/both/index.ts',
  'src/config.dev.ts',
  'src/styles.css',
  'src/data.json',
  'src/logo.svg',
  'src/esm.mts',
  'src/cjs.cts',
  'up.ts',
];

let root: string;

// Babel 7 runs in a child process with its own module cache: `babel-core-7` is @babel/core 7 installed under an alias.
const transformWithBabel7 = (code: string): string =>
  JSON.parse(
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        [
          "import babel from 'babel-core-7';",
          'const { CODE, FILENAME, PLUGIN } = process.env;',
          "const result = babel.transformSync(CODE, { babelrc: false, configFile: false, filename: FILENAME, parserOpts: { plugins: ['typescript', 'importAttributes'] }, plugins: [[PLUGIN, { extension: 'mjs' }]] });",
          'process.stdout.write(JSON.stringify(result.code));',
        ].join('\n'),
      ],
      {
        encoding: 'utf8',
        env: { ...process.env, CODE: code, FILENAME: path.join(root, 'src/index.ts'), PLUGIN: plugin },
      },
    ),
  ) as string;

const transform = (
  code: string,
  extension = 'mjs',
  filename: string | undefined = path.join(root, 'src/index.ts'),
): string =>
  transformSync(code, {
    babelrc: false,
    configFile: false,
    ...(filename ? { filename } : {}),
    parserOpts: { plugins: ['typescript'] },
    plugins: [[plugin, { extension }]],
  })?.code ?? '';

describe('import-extension plugin', () => {
  beforeAll(() => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-import-extension-'));
    for (const file of FILES) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), '');
    }
  });

  afterAll(() => {
    rmSync(root, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it.each([
      "import a from 'react';",
      "import a from 'node:fs';",
      "import a from '/abs/path';",
      "import a from '#internal';",
      "import a from 'https://example.com/a.js';",
      "import a from './raw?inline';",
      "import a from './page#top';",
      "import a from './already.mjs';",
    ])('keeps %s', (code) => {
      expect(transform(code)).toBe(code);
    });

    it('keeps type-only imports and exports', () => {
      const code =
        "import type { T } from './types';\nexport type { U } from './types';\nexport type * from './types';";

      expect(transform(code)).toBe(code);
    });

    it.each([
      "import './styles.css';",
      "import logo from './logo.svg';",
      "import data from './data.json' with { type: 'json' };",
    ])('keeps the asset import %s with its attributes', (code) => {
      expect(transform(code)).toBe(code);
    });

    it('keeps an unknown extension that is not a file', () => {
      expect(transform("import a from './missing.graphql';")).toBe("import a from './missing.graphql';");
    });

    it('keeps a dynamic import that is not a string literal', () => {
      const code = 'const a = import(`./${name}`);';

      expect(transform(code)).toBe(code);
    });

    it('rejects a missing or unknown extension option', () => {
      expect(() => transform("import a from './a';", 'ts')).toThrow('the extension option must be one of cjs, js, mjs');
    });
  });

  describe('positive cases', () => {
    it.each([
      ["import a from './no-ext';", "import a from './no-ext.mjs';"],
      ["import a from './utils';", "import a from './utils/index.mjs';"],
      ["import a from './utils/';", "import a from './utils/index.mjs';"],
      ["import a from './config.dev';", "import a from './config.dev.mjs';"],
      ["import a from './x.js';", "import a from './x.mjs';"],
      ["import a from './y.ts';", "import a from './y.mjs';"],
      ["import a from './esm.mts';", "import a from './esm.mjs';"],
      ["import a from './cjs.cts';", "import a from './cjs.mjs';"],
      ["import a from '../up';", "import a from '../up.mjs';"],
      ["import a from './generated';", "import a from './generated.mjs';"],
    ])('rewrites %s', (code, expected) => {
      expect(transform(code)).toBe(expected);
    });

    it('prefers a file over a folder of the same name, like Node and TypeScript', () => {
      expect(transform("import a from './both';")).toBe("import a from './both.mjs';");
    });

    it('rewrites re-exports and dynamic imports', () => {
      expect(
        transform(
          "export * from './no-ext';\nexport * as ns from './utils';\nexport { a } from './x.js';\nconst l = import('./no-ext');",
        ),
      ).toBe(
        "export * from './no-ext.mjs';\nexport * as ns from './utils/index.mjs';\nexport { a } from './x.mjs';\nconst l = import('./no-ext.mjs');",
      );
    });

    it('keeps the quote style of the source', () => {
      expect(transform('import a from "./no-ext";')).toBe('import a from "./no-ext.mjs";');
    });

    it.each(['cjs', 'js'])('writes the %s extension', (extension) => {
      expect(transform("import a from './y.ts';", extension)).toBe(`import a from './y.${extension}';`);
    });

    it('checks each path on disk once per build', () => {
      const statSpy = jest.spyOn(fs, 'statSync');

      transform("import a from './no-ext';\nimport b from './no-ext';\nexport * from './no-ext';");
      const checked = statSpy.mock.calls.map(([file]) => String(file));
      statSpy.mockRestore();

      expect(checked.length).toBeGreaterThan(0);
      expect(new Set(checked).size).toBe(checked.length);
    });

    it('adds the extension to bare names and replaces script extensions without a file name', () => {
      expect(transform("import a from './a';\nimport b from './b.ts';\nimport './c.css';", 'mjs', undefined)).toBe(
        "import a from './a.mjs';\nimport b from './b.mjs';\nimport './c.css';",
      );
    });
  });

  describe('on Babel 7', () => {
    describe('negative cases', () => {
      it('keeps assets and their import attributes', () => {
        const code = "import './styles.css';\nimport data from './data.json' with { type: 'json' };";

        expect(transformWithBabel7(code)).toBe(code);
      });
    });

    describe('positive cases', () => {
      it('rewrites imports, folders, re-exports and dynamic imports', () => {
        expect(
          transformWithBabel7(
            "import a from './no-ext';\nimport b from './both';\nexport * from './utils';\nconst l = import('./x.js');",
          ),
        ).toBe(
          "import a from './no-ext.mjs';\nimport b from './both.mjs';\nexport * from './utils/index.mjs';\nconst l = import('./x.mjs');",
        );
      });
    });
  });
});
