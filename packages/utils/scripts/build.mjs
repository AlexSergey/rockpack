import { transformFileSync } from '@babel/core';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const _require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcDir = resolve(root, 'src');
const outDir = resolve(root, 'lib/esm');

const babelOptions = {
  babelrc: false,
  configFile: false,
  plugins: [[_require.resolve('babel-plugin-add-import-extension'), { extension: 'mjs' }]],
  presets: [
    [_require.resolve('@babel/preset-env'), { modules: false, targets: { node: 'current' } }],
    [_require.resolve('@babel/preset-typescript')],
  ],
};

const collectFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
};

const files = collectFiles(srcDir).filter((f) => {
  const ext = extname(f);
  return (ext === '.ts' || ext === '.tsx') && !f.endsWith('.d.ts');
});

for (const file of files) {
  const result = transformFileSync(file, babelOptions);
  const rel = relative(srcDir, file);
  const outFile = join(outDir, rel.replace(/\.tsx?$/, '.mjs'));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, result.code);
}

console.log(`ESM: built ${files.length} file(s) → ${outDir}`);
