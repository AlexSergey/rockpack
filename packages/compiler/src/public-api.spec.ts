import { expectTypeOf } from 'expect-type';

import type { CompilerResult, frontendCompiler, LibraryCompilerOptions } from './index.js';

type FrontendConf = NonNullable<Parameters<typeof frontendCompiler>[0]>;

// Compile-time checks of the public API: `lint:ts` fails when a type widens or loses a member.
describe('public API types', () => {
  describe('negative cases', () => {
    it('does not accept arbitrary values for html, port or styles', () => {
      expectTypeOf<number>().not.toExtend<FrontendConf['html']>();
      expectTypeOf<string>().not.toExtend<FrontendConf['port']>();
      expectTypeOf<true>().not.toExtend<FrontendConf['styles']>();
    });
  });

  describe('positive cases', () => {
    it('accepts every documented form of html', () => {
      expectTypeOf<boolean>().toExtend<FrontendConf['html']>();
      expectTypeOf<{ template: string; title: string }>().toExtend<FrontendConf['html']>();
      expectTypeOf<{ filename: string; template: string }[]>().toExtend<FrontendConf['html']>();
    });

    it('resolves to a result told apart by kind', () => {
      expectTypeOf(null as unknown as ReturnType<typeof frontendCompiler>).resolves.toEqualTypeOf<CompilerResult>();
      expectTypeOf<CompilerResult['kind']>().toEqualTypeOf<'build' | 'config' | 'dev-server' | 'watch'>();
    });

    it('requires the library name in the options object', () => {
      expectTypeOf<LibraryCompilerOptions>().toHaveProperty('name').toEqualTypeOf<string>();
    });
  });
});
