import type { Linter } from 'eslint';

import { expectTypeOf } from 'expect-type';

import type { commitlintConfig } from './commitlint.js';
import type { makeConfig, MakeConfigOptions } from './index.js';
import type { stylelintConfig } from './stylelint.js';

// Compile-time checks of the public API: `lint:ts` fails when a type widens or loses a member.
describe('public API types', () => {
  describe('negative cases', () => {
    it('does not accept a string for the boolean options', () => {
      expectTypeOf<'yes'>().not.toExtend<MakeConfigOptions['react']>();
      expectTypeOf<'yes'>().not.toExtend<MakeConfigOptions['jest']>();
      expectTypeOf<true>().not.toExtend<MakeConfigOptions['ignoreFile']>();
    });
  });

  describe('positive cases', () => {
    it('returns a flat config array', () => {
      expectTypeOf<typeof makeConfig>().returns.toEqualTypeOf<Linter.Config[]>();
      expectTypeOf<typeof makeConfig>().parameter(0).toEqualTypeOf<MakeConfigOptions | undefined>();
    });

    it('exposes the shared stylelint and commitlint configs', () => {
      expectTypeOf<typeof stylelintConfig>().toHaveProperty('extends');
      expectTypeOf<typeof commitlintConfig>().toHaveProperty('rules');
    });
  });
});
