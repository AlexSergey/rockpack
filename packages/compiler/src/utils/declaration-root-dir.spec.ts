import path from 'node:path';

import { findDeclarationRootDir } from './declaration-root-dir.js';
import { runTsc } from './run-tsc.js';

jest.mock('./run-tsc.js', () => ({ runTsc: jest.fn() }));

const root = path.resolve('/project');
const tsconfig = path.join(root, 'tsconfig.json');
const generated = path.join(root, 'node_modules', '.cache', 'rockpack', 'tsc', 'declarations.json');
const files = [path.join(root, 'src', 'bin', 'cli.ts')];

// Answers --showConfig and --listFilesOnly with the given outputs.
const answer = (shown: string, listed = ''): void => {
  jest
    .mocked(runTsc)
    .mockImplementation((_tsc, args) =>
      Promise.resolve({ code: 0, output: args.includes('--showConfig') ? shown : listed }),
    );
};

describe('findDeclarationRootDir', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('falls back to the program sources when the tsconfig cannot be shown', async () => {
      answer(
        "error TS5083: Cannot read file 'tsconfig.json'.",
        `${path.join(root, 'src', 'index.ts')}\n${files[0] ?? ''}\n`,
      );

      await expect(findDeclarationRootDir('tsc', root, tsconfig, generated, files)).resolves.toBe(
        path.join(root, 'src'),
      );
    });

    it('falls back to the listed files when tsc lists no sources', async () => {
      answer('{"compilerOptions":{}}', 'error TS6059: not under rootDir\n  The file is in the program because:\n');

      await expect(findDeclarationRootDir('tsc', root, tsconfig, generated, files)).resolves.toBe(
        path.join(root, 'src', 'bin'),
      );
    });
  });

  describe('positive cases', () => {
    it("uses the project's rootDir relative to its tsconfig", async () => {
      answer('{"compilerOptions":{"rootDir":"./lib"}}');

      await expect(findDeclarationRootDir('tsc', root, tsconfig, generated, files)).resolves.toBe(
        path.join(root, 'lib'),
      );
      expect(runTsc).toHaveBeenCalledTimes(1);
    });

    it('uses the common folder of the program sources without declarations and packages', async () => {
      answer(
        '{"compilerOptions":{}}',
        [
          "error TS5011: The common source directory of 'declarations.json' is '../../../../src'.",
          path.join(root, 'node_modules', 'typescript', 'lib', 'lib.es2022.d.ts'),
          path.join(root, 'node_modules', 'pkg', 'index.ts'),
          path.join(root, 'types', 'global.d.ts'),
          path.join(root, 'src', 'lib', 'x.ts'),
          files[0] ?? '',
        ].join('\n'),
      );

      await expect(findDeclarationRootDir('tsc', root, tsconfig, generated, files)).resolves.toBe(
        path.join(root, 'src'),
      );
      expect(runTsc).toHaveBeenCalledWith('tsc', ['--listFilesOnly', '-p', generated], root);
    });
  });
});
