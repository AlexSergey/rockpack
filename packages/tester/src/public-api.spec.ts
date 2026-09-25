import { expectTypeOf } from 'expect-type';

import type { CoverageOptions, tester, TesterOptions, TestResults } from './index.js';

// Compile-time checks of the public API: `lint:ts` fails when a type widens or loses a member.
describe('public API types', () => {
  describe('negative cases', () => {
    it('does not accept a string for coverage or watch', () => {
      expectTypeOf<'on'>().not.toExtend<TesterOptions['coverage']>();
      expectTypeOf<'on'>().not.toExtend<TesterOptions['watch']>();
    });
  });

  describe('positive cases', () => {
    it('takes coverage as a boolean or coverage options', () => {
      expectTypeOf<TesterOptions['coverage']>().toEqualTypeOf<boolean | CoverageOptions | undefined>();
    });

    it('resolves to the jest results or undefined', () => {
      expectTypeOf<typeof tester>().returns.resolves.toEqualTypeOf<TestResults | undefined>();
    });
  });
});
