import path from 'node:path';

import { commitlintConfig } from './commitlint.js';
import { stylelintConfig } from './stylelint.js';

// Under Jest import.meta.resolve becomes require.resolve, which cannot see presets exported for
// `import` only; the real resolution is checked against the installed tarball in packaging-e2e.
jest.mock('./resolve.js', () => ({ resolveFromCodestyle: (name: string): string => `/resolved/${name}` }));

const asList = (value: unknown): unknown[] => (Array.isArray(value) ? value : [value]);

describe('shared configs', () => {
  describe('negative cases', () => {
    it('names no preset or plugin by bare package name', () => {
      const references = [
        ...asList(stylelintConfig.extends),
        ...asList(stylelintConfig.plugins),
        ...asList(commitlintConfig.extends),
      ];

      expect(references.filter((reference) => typeof reference !== 'string' || !path.isAbsolute(reference))).toEqual(
        [],
      );
    });
  });

  describe('positive cases', () => {
    it('extends the stylelint presets and the scss plugin', () => {
      expect(stylelintConfig.extends).toEqual([
        '/resolved/stylelint-config-tailwindcss',
        '/resolved/stylelint-config-standard-scss',
        '/resolved/stylelint-config-prettier-scss',
        '/resolved/stylelint-config-clean-order',
      ]);
      expect(stylelintConfig.plugins).toEqual(['/resolved/stylelint-scss']);
    });

    it('extends the conventional commitlint config and restricts the commit types', () => {
      expect(commitlintConfig.extends).toEqual(['/resolved/@commitlint/config-conventional']);
      expect(commitlintConfig.rules?.['type-enum']).toEqual([
        2,
        'always',
        ['ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style'],
      ]);
    });
  });
});
