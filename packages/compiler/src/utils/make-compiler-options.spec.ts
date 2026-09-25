import path from 'node:path';
import ts from 'typescript';

import { makeCompilerOptions } from './make-compiler-options.js';

const root = path.resolve(__dirname, '../__fixtures__/source-project');
const outDir = path.join(root, 'out');

describe('makeCompilerOptions', () => {
  describe('negative cases', () => {
    it('throws when the tsconfig does not exist', () => {
      expect(() => makeCompilerOptions(root, 'tsconfig.missing.json', outDir)).toThrow(
        'Could not find tsconfig at tsconfig.missing.json',
      );
    });

    it('sets no deprecated baseUrl or node10 resolution', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir);

      expect(options).not.toHaveProperty('baseUrl');
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- asserting the deprecated value is gone
      expect(options.moduleResolution).not.toBe(ts.ModuleResolutionKind.Node10);
    });
  });

  describe('positive cases', () => {
    it('emits declarations only into the output folder', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir);

      expect(options).toMatchObject({ declaration: true, emitDeclarationOnly: true, noEmit: false, outDir });
    });

    it('keeps the module settings of the project', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir);

      expect(options.module).toBe(ts.ModuleKind.ESNext);
    });

    it('keeps the project files from the tsconfig', () => {
      const { fileNames } = makeCompilerOptions(root, 'tsconfig.json', outDir);

      expect(fileNames.map((file) => path.relative(root, file)).sort()).toEqual(
        ['src/index.ts', 'src/label.tsx', 'src/utils/sum.ts'].map((file) => path.join(...file.split('/'))),
      );
    });
  });
});
