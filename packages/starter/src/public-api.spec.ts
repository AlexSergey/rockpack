import { expectTypeOf } from 'expect-type';

import type { Args } from './lib/get-args.js';

// Compile-time checks of the CLI arguments: `lint:ts` fails when a type widens or loses a member.
describe('CLI argument types', () => {
  describe('negative cases', () => {
    it('accepts only the known application types', () => {
      expectTypeOf<'desktop'>().not.toExtend<Args['appType']>();
    });
  });

  describe('positive cases', () => {
    it('keeps test mode required and the other arguments optional', () => {
      expectTypeOf<Args['testMode']>().toEqualTypeOf<boolean>();
      expectTypeOf<Args['appType']>().toEqualTypeOf<'component' | 'csr' | 'library' | 'ssr' | undefined>();
      expectTypeOf<Args['yes']>().toEqualTypeOf<boolean | undefined>();
    });
  });
});
