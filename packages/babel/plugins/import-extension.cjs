'use strict';

/*
 * Gives the relative imports of a per-file build the extension of its output format, so Node can load the
 * emitted `.mjs`/`.cjs`/`.js` files: `./sum` and `./sum.ts` become `./sum.mjs`, a folder becomes
 * `./folder/index.mjs`. Resolution follows Node and TypeScript: an existing file (an asset such as `.css` or
 * `.json`) stays as it is, then a script file wins over a folder with an index. Only the string of the source
 * changes, so import attributes, type modifiers and quotes are kept. Works with Babel 7 and Babel 8.
 *
 * Options: { extension: 'cjs' | 'js' | 'mjs' }
 */
const fs = require('node:fs');
const path = require('node:path');

const SCRIPT_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts'];
const TARGETS = ['cjs', 'js', 'mjs'];

const isRelative = (specifier) =>
  specifier === '.' || specifier === '..' || specifier.startsWith('./') || specifier.startsWith('../');

module.exports = function importExtension(api, options) {
  api.assertVersion('^7.0.0 || ^8.0.0');

  const target = options && options.extension;
  if (!TARGETS.includes(target)) {
    throw new Error(`import-extension: the extension option must be one of ${TARGETS.join(', ')}`);
  }

  // One stat per path and build: 'file', 'dir' or 'none'.
  const kinds = new Map();
  const kind = (file) => {
    let value = kinds.get(file);
    if (value === undefined) {
      const stats = fs.statSync(file, { throwIfNoEntry: false });
      value = stats === undefined ? 'none' : stats.isDirectory() ? 'dir' : 'file';
      kinds.set(file, value);
    }

    return value;
  };

  const rewrite = (specifier, filename) => {
    if (!isRelative(specifier) || /[?#]/.test(specifier)) {
      return specifier;
    }
    const ext = path.extname(specifier);
    if (SCRIPT_EXTENSIONS.includes(ext)) {
      return `${specifier.slice(0, -ext.length)}.${target}`;
    }
    if (!filename) {
      return ext === '' ? `${specifier}.${target}` : specifier;
    }

    const base = path.resolve(path.dirname(filename), specifier);
    if (kind(base) === 'file') {
      return specifier;
    }
    if (SCRIPT_EXTENSIONS.some((extension) => kind(`${base}${extension}`) === 'file')) {
      return `${specifier}.${target}`;
    }
    if (
      kind(base) === 'dir' &&
      SCRIPT_EXTENSIONS.some((extension) => kind(path.join(base, `index${extension}`)) === 'file')
    ) {
      return `${specifier.replace(/\/$/, '')}/index.${target}`;
    }

    // Nothing on disk yet (a file generated during the build): a bare name still gets the extension.
    return ext === '' ? `${specifier}.${target}` : specifier;
  };

  const update = (source, filename) => {
    if (!source || source.type !== 'StringLiteral') {
      return;
    }
    const next = rewrite(source.value, filename);
    if (next === source.value) {
      return;
    }
    const quote = source.extra && typeof source.extra.raw === 'string' ? source.extra.raw[0] : "'";
    source.value = next;
    source.extra = { ...source.extra, raw: `${quote}${next}${quote}`, rawValue: next };
  };

  return {
    name: 'rockpack-import-extension',
    visitor: {
      // Babel 7 parses import('...') as a call with an Import callee.
      CallExpression(nodePath, state) {
        if (nodePath.node.callee.type === 'Import') {
          update(nodePath.node.arguments[0], state.filename);
        }
      },
      ExportAllDeclaration(nodePath, state) {
        if (nodePath.node.exportKind !== 'type') {
          update(nodePath.node.source, state.filename);
        }
      },
      ExportNamedDeclaration(nodePath, state) {
        if (nodePath.node.exportKind !== 'type') {
          update(nodePath.node.source, state.filename);
        }
      },
      ImportDeclaration(nodePath, state) {
        if (nodePath.node.importKind !== 'type') {
          update(nodePath.node.source, state.filename);
        }
      },
      // Babel 8 parses import('...') as an ImportExpression.
      ImportExpression(nodePath, state) {
        update(nodePath.node.source, state.filename);
      },
    },
  };
};
