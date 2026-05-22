import { transformFileSync } from '@babel/core';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const _require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcDir = resolve(root, 'src');
const outDir = resolve(root, 'lib/cjs');

const babelOptions = {
  babelrc: false,
  configFile: false,
  plugins: [
    [_require.resolve('babel-plugin-add-import-extension'), { extension: 'cjs' }],
    [_require.resolve('@babel/plugin-transform-modules-commonjs')],
  ],
  presets: [[_require.resolve('@babel/preset-typescript')]],
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
  if (f.endsWith('.d.ts') || f.endsWith('.d.cts')) return false;
  if (basename(f) === 'index.ts') return false; // ESM-only entry
  return ext === '.ts' || ext === '.tsx' || ext === '.cts';
});

for (const file of files) {
  const result = transformFileSync(file, babelOptions);
  const rel = relative(srcDir, file);
  const outFile = join(outDir, rel.replace(/\.(tsx?|cts)$/, '.cjs'));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, result.code);
}

console.log(`CJS: built ${files.length} file(s) → ${outDir}`);
