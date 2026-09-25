import type { RunResult } from '@rockpack/e2e-tools';

import { packPackages, readLockedVersions, run } from '@rockpack/e2e-tools';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const MAIN_EXPORTS: Readonly<Record<string, readonly string[]>> = {
  '@rockpack/babel': ['createBabelPresets'],
  '@rockpack/codestyle': ['makeConfig'],
  '@rockpack/compiler': [
    'backendCompiler',
    'frontendCompiler',
    'isomorphicCompiler',
    'libraryCompiler',
    'makeWebpackConfig',
    'RockpackError',
    'sourceCompiler',
  ],
  '@rockpack/tester': ['tester'],
  '@rockpack/utils': ['getMode', 'readPackageJson', 'setMode'],
};

const CONSUMER_TS = `import { createBabelPresets } from '@rockpack/babel';
import { makeConfig } from '@rockpack/codestyle';
import { frontendCompiler, RockpackError } from '@rockpack/compiler';
import { tester } from '@rockpack/tester';
import { getMode } from '@rockpack/utils';

const presets: object = createBabelPresets({ framework: 'react', typescript: true });
const lint: unknown[] = makeConfig();
const mode: string = getMode();
const error = new RockpackError('INVALID_CONFIG', 'message');
const code: 'BUILD_FAILED' | 'DTS_FAILED' | 'INVALID_CONFIG' | 'INVALID_ENTRY' = error.code;

export { code, frontendCompiler, lint, mode, presets, tester };
`;

const locked = readLockedVersions();

const lockedVersion = (name: string): string => {
  const version = locked.get(name);
  if (!version) {
    throw new Error(`${name} is not in package-lock.json`);
  }

  return version;
};

describe('packages installed from tarballs', () => {
  let dir: string;

  const node = (script: string, type: 'cjs' | 'esm'): Promise<RunResult> => {
    const file = path.join(dir, type === 'esm' ? 'check.mjs' : 'check.cjs');
    writeFileSync(file, script);

    return run('node', [file], { cwd: dir });
  };

  beforeAll(async () => {
    const tarballs = await packPackages();
    const specs = Object.fromEntries([...tarballs].map(([name, tarball]) => [name, `file:${tarball}`]));
    dir = mkdtempSync(path.join(os.tmpdir(), 'rockpack-packaging-'));
    writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          dependencies: {
            ...specs,
            '@types/node': lockedVersion('@types/node'),
            typescript: lockedVersion('typescript'),
          },
          name: 'consumer',
          overrides: specs,
          private: true,
          type: 'module',
        },
        null,
        2,
      ),
    );
    const { code, output } = await run('npm', ['install', '--no-audit', '--no-fund', '--prefer-offline'], {
      cwd: dir,
      timeout: 600_000,
    });
    if (code !== 0) {
      throw new Error(`npm install failed\n${output}`);
    }
  });

  afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('hides the files outside the exports map', async () => {
      const { code, output } = await node("require('@rockpack/compiler/lib/cjs/index.cjs');", 'cjs');

      expect(code).toBe(1);
      expect(output).toContain('ERR_PACKAGE_PATH_NOT_EXPORTED');
    });

    it('fails type checking on a wrong option', async () => {
      writeFileSync(
        path.join(dir, 'tsconfig.json'),
        JSON.stringify({ extends: '@rockpack/tsconfig/tsconfig.node.json' }),
      );
      writeFileSync(
        path.join(dir, 'consumer.ts'),
        "import { createBabelPresets } from '@rockpack/babel';\n\ncreateBabelPresets({ framework: 'vue' });\n",
      );
      const { code, output } = await run('npx', ['tsc', '--noEmit'], { cwd: dir });

      expect(code).toBe(2);
      expect(output).toContain(`consumer.ts(3,22): error TS2322: Type '"vue"'`);
    });
  });

  describe('positive cases', () => {
    it.each(Object.entries(MAIN_EXPORTS))('imports %s as ESM', async (name, exports) => {
      const { code, output } = await node(
        `const m = await import('${name}');\nconsole.log(JSON.stringify(${JSON.stringify(exports)}.map((key) => typeof m[key])));`,
        'esm',
      );

      expect(code).toBe(0);
      expect(JSON.parse(output.trim().split('\n').at(-1) ?? '')).not.toContain('undefined');
    });

    it.each(Object.entries(MAIN_EXPORTS))('requires %s as CommonJS', async (name, exports) => {
      const { code, output } = await node(
        `const m = require('${name}');\nconsole.log(JSON.stringify(${JSON.stringify(exports)}.map((key) => typeof m[key])));`,
        'cjs',
      );

      expect(code).toBe(0);
      expect(JSON.parse(output.trim().split('\n').at(-1) ?? '')).not.toContain('undefined');
    });

    it('resolves the subpath exports', async () => {
      const { code } = await node(
        "require.resolve('@rockpack/babel/plugins/rename-cjs-globals');\nrequire.resolve('@rockpack/babel/plugins/import-extension');\nrequire('@rockpack/utils/polyfills/text-encoder.fix');",
        'cjs',
      );

      expect(code).toBe(0);
    });

    it('lints styles with the shared stylelint config', async () => {
      writeFileSync(
        path.join(dir, '.stylelintrc.cjs'),
        "module.exports = require('@rockpack/codestyle/stylelint').stylelintConfig;\n",
      );
      writeFileSync(path.join(dir, 'valid.scss'), '.title {\n  color: #fff;\n}\n');
      writeFileSync(path.join(dir, 'invalid.scss'), '.title {\n  color: red;\n}\n');

      const valid = await run('npx', ['stylelint', 'valid.scss'], { cwd: dir });
      const invalid = await run('npx', ['stylelint', 'invalid.scss'], { cwd: dir });

      expect(valid).toMatchObject({ code: 0, output: '' });
      expect(invalid.code).toBe(2);
      expect(invalid.output).toContain('color-named');
    });

    it('checks commit messages with the shared commitlint config', async () => {
      writeFileSync(
        path.join(dir, '.commitlintrc.cjs'),
        "module.exports = require('@rockpack/codestyle/commitlint').commitlintConfig;\n",
      );
      // --edit (the commit-msg hook form) looks for the git root.
      await run('git', ['init', '--quiet'], { cwd: dir });
      writeFileSync(path.join(dir, 'valid-message'), 'feat: add a button\n');
      writeFileSync(path.join(dir, 'invalid-message'), 'build: bump the version\n');

      const valid = await run('npx', ['commitlint', '--config', '.commitlintrc.cjs', '--edit', 'valid-message'], {
        cwd: dir,
      });
      const invalid = await run('npx', ['commitlint', '--config', '.commitlintrc.cjs', '--edit', 'invalid-message'], {
        cwd: dir,
      });

      expect(valid.code).toBe(0);
      expect(invalid.code).toBe(1);
      expect(invalid.output).toContain('type-enum');
    });

    it('type checks a consumer against the shipped types and the shared tsconfig', async () => {
      writeFileSync(
        path.join(dir, 'tsconfig.json'),
        JSON.stringify({ extends: '@rockpack/tsconfig/tsconfig.node.json' }),
      );
      writeFileSync(path.join(dir, 'consumer.ts'), CONSUMER_TS);
      const { code, output } = await run('npx', ['tsc', '--noEmit'], { cwd: dir });

      expect(output).toBe('');
      expect(code).toBe(0);
    });

    it('runs the rockpack binary', async () => {
      const { version } = JSON.parse(
        readFileSync(path.join(dir, 'node_modules/@rockpack/starter/package.json'), 'utf8'),
      ) as { version: string };
      const { code, output } = await run('npx', ['rockpack', '-v'], { cwd: dir });

      expect(code).toBe(0);
      expect(output).toContain(version);
    });
  });
});
