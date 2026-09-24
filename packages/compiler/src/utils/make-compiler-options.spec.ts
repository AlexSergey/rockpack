import path from 'node:path';
import ts from 'typescript';

import { makeCompilerOptions } from './make-compiler-options.js';

const root = path.resolve(__dirname, '../__fixtures__/source-project');
const outDir = path.join(root, 'out');

describe('makeCompilerOptions', () => {
  describe('negative cases', () => {
    it('throws when the tsconfig does not exist', () => {
      expect(() => makeCompilerOptions(root, 'tsconfig.missing.json', outDir, 'esm')).toThrow(
        'Could not find tsconfig at tsconfig.missing.json',
      );
    });

    it('only sets the output folder for an unknown format', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir, 'umd');

      expect(options.outDir).toBe(outDir);
      expect(options.declaration).toBeUndefined();
      expect(options.module).toBe(ts.ModuleKind.ESNext);
    });
  });

  describe('positive cases', () => {
    it('emits declarations only for dts', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir, 'dts');

      expect(options).toMatchObject({ declaration: true, emitDeclarationOnly: true, outDir });
    });

    it('targets CommonJS for cjs', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir, 'cjs');

      expect(options).toMatchObject({
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.Node10,
        outDir,
      });
    });

    it('targets ESNext for esm', () => {
      const { options } = makeCompilerOptions(root, 'tsconfig.json', outDir, 'esm');

      expect(options).toMatchObject({ module: ts.ModuleKind.ESNext, outDir, target: ts.ScriptTarget.ESNext });
    });

    it('keeps the project files from the tsconfig', () => {
      const { fileNames } = makeCompilerOptions(root, 'tsconfig.json', outDir, 'esm');

      expect(fileNames.map((file) => path.relative(root, file)).sort()).toEqual(
        ['src/index.ts', 'src/label.tsx', 'src/utils/sum.ts'].map((file) => path.join(...file.split('/'))),
      );
    });
  });
});
