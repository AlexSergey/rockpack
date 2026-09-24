import { existsSync } from 'node:fs';
import path from 'node:path';

import { buildFixture } from './fixtures';

describe('makeWebpackConfig', () => {
  describe('positive cases', () => {
    let dir: string;
    let output: string;

    beforeAll(async () => {
      ({ dir, output } = await buildFixture('config-only'));
    });

    it('writes no files', () => {
      expect(existsSync(path.join(dir, 'dist'))).toBe(false);
    });

    it('passes the config, modules, plugins and mode to the callback', () => {
      expect(output).toContain('{"hasModules":true,"mode":"production"}');
    });

    it('returns the config with the callback changes applied', () => {
      const line = output.split('\n').find((entry) => entry.startsWith('{"alias"')) ?? '{}';
      const config = JSON.parse(line) as { alias: unknown; entry: string[]; mode: string; plugins: number };

      expect(config).toMatchObject({ alias: { custom: './src' }, entry: ['index'], mode: 'production' });
      expect(config.plugins).toBeGreaterThan(0);
    });
  });
});
