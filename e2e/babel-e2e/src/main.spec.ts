import { createBabelPresets } from '@rockpack/babel';
import { execFileSync } from 'node:child_process';

// Smoke test of the built package; the preset details are covered by the packages/babel unit tests.
// Jest resolves every import through the CommonJS condition, so the entries are loaded by a real Node process.
const runNode = (args: string[]): string =>
  execFileSync(process.execPath, args, { cwd: __dirname, encoding: 'utf8' }).trim();

const probe =
  'typeof m.createBabelPresets + " " + JSON.stringify(m.createBabelPresets().presets).includes("preset-env")';

describe('@rockpack/babel build', () => {
  describe('negative cases', () => {
    it('adds no React preset without the react framework', () => {
      const { presets } = createBabelPresets({ framework: 'none' });

      expect(JSON.stringify(presets)).not.toContain('@babel/preset-react');
    });
  });

  describe('positive cases', () => {
    it('loads createBabelPresets from the ESM entry', () => {
      expect(
        runNode(['--input-type=module', '-e', `const m = await import('@rockpack/babel'); console.log(${probe});`]),
      ).toBe('function true');
    });

    it('loads createBabelPresets from the CommonJS entry', () => {
      expect(runNode(['-e', `const m = require('@rockpack/babel'); console.log(${probe});`])).toBe('function true');
    });
  });
});
