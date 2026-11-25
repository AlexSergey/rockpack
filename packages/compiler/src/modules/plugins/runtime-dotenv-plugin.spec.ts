import type { Compiler } from 'webpack';

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import webpack from 'webpack';

import { RuntimeDotenvPlugin } from './runtime-dotenv-plugin.js';

type BannerOptions = {
  readonly banner: string;
  readonly entryOnly: boolean;
  readonly raw: boolean;
  readonly test: RegExp;
};

type Files = Readonly<Record<string, string>>;

describe('RuntimeDotenvPlugin', () => {
  let root: string;

  // The options of the banner the plugin adds to a project with the given files.
  const apply = (files: Files): BannerOptions => {
    const banners: BannerOptions[] = [];
    class BannerPlugin {
      constructor(options: BannerOptions) {
        banners.push(options);
      }

      apply(): void {
        // The options are what the specs check.
      }
    }
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(path.join(root, name), content);
    }
    new RuntimeDotenvPlugin({
      allowEmptyValues: true,
      defaults: '.env.defaults' in files,
      path: path.join(root, '.env'),
      safe: '.env.example' in files,
      silent: !('.env' in files),
    }).apply({ webpack: { BannerPlugin } } as unknown as Compiler);

    return banners[0] as BannerOptions;
  };

  // process.env after the code of the banner ran in a process with the given environment.
  const start = (files: Files, env: Record<string, string> = {}): Record<string, string> => {
    runInNewContext(apply(files).banner, { process: { env } });

    return env;
  };

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-runtime-dotenv-'));
  });

  afterEach(() => {
    rmSync(root, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('fails when a variable from .env.example is missing in .env', () => {
      expect(() => apply({ '.env': 'PORT=8888\n', '.env.example': 'PORT=\nTOKEN=\n' })).toThrow(
        'Missing environment variable: TOKEN',
      );
    });

    it('keeps the variables the process already has, empty ones too', () => {
      expect(start({ '.env': 'PORT=8888\nHOST=localhost\n' }, { HOST: '', PORT: '3000' })).toEqual({
        HOST: '',
        PORT: '3000',
      });
    });
  });

  describe('positive cases', () => {
    it('sets the variables the process does not have', () => {
      expect(start({ '.env': 'PORT=8888\nEMPTY=\n' }, { HOME: '/root' })).toEqual({
        EMPTY: '',
        HOME: '/root',
        PORT: '8888',
      });
    });

    it('fills the missing values from .env.defaults', () => {
      expect(start({ '.env': 'PORT=8888\n', '.env.defaults': 'PORT=1\nTIMEOUT=30\n' })).toEqual({
        PORT: '8888',
        TIMEOUT: '30',
      });
    });

    it('works with .env.defaults alone', () => {
      expect(start({ '.env.defaults': 'TIMEOUT=30\n' })).toEqual({ TIMEOUT: '30' });
    });

    it('keeps the values that need escaping', () => {
      expect(start({ '.env': 'JSON=\'{"a":["b"]}\'\nPATTERN=[name]-[hash]\nQUOTE=it\'s "x" \\ y\n' })).toEqual({
        JSON: '{"a":["b"]}',
        PATTERN: '[name]-[hash]',
        QUOTE: 'it\'s "x" \\ y',
      });
    });

    it('adds no text webpack replaces in a banner', () => {
      const { banner } = apply({ '.env': 'PATTERN=[name]-[hash]-[file]\n' });

      expect(banner).not.toMatch(/\[(?:name|hash|file)\]/);
    });

    it('adds raw code to the JavaScript files of the entries only', () => {
      const { banner, entryOnly, raw, test } = apply({ '.env': 'PORT=8888\n' });

      expect(() => new webpack.BannerPlugin({ banner, entryOnly, raw, test })).not.toThrow();
      expect({ entryOnly, raw }).toEqual({ entryOnly: true, raw: true });
      expect(['index.js', 'index.cjs', 'index.mjs', 'css/styles.css'].map((file) => test.test(file))).toEqual([
        true,
        true,
        true,
        false,
      ]);
    });
  });
});
