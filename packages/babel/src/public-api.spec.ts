import type { TransformOptions } from '@babel/core';

import { expectTypeOf } from 'expect-type';

import type { BabelMergeFunction, createBabelPresets, CreateBabelPresetsOptions, Framework, Modules } from './index.js';

// Compile-time checks of the public API: `lint:ts` fails when a type widens or loses a member.
describe('public API types', () => {
  describe('negative cases', () => {
    it('accepts only the known frameworks and module formats', () => {
      expectTypeOf<'vue'>().not.toExtend<Framework>();
      expectTypeOf<'esm'>().not.toExtend<Modules>();
    });
  });

  describe('positive cases', () => {
    it('takes optional options and returns Babel options', () => {
      expectTypeOf<typeof createBabelPresets>().parameter(0).toEqualTypeOf<CreateBabelPresetsOptions | undefined>();
      expectTypeOf<typeof createBabelPresets>().returns.toEqualTypeOf<TransformOptions>();
      expectTypeOf<Framework>().toEqualTypeOf<'none' | 'react'>();
    });

    it('types a rockpack.babel merge function', () => {
      expectTypeOf<BabelMergeFunction>().parameter(0).toHaveProperty('framework').toEqualTypeOf<Framework>();
      expectTypeOf<BabelMergeFunction>().returns.toEqualTypeOf<TransformOptions>();
    });
  });
});
