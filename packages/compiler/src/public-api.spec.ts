import { expectTypeOf } from 'expect-type';

import type {
  BuildResult,
  CompilerCallback,
  CompilerConf,
  CompilerResult,
  frontendCompiler,
  HtmlPage,
  isomorphicCompiler,
  LibraryCompilerOptions,
  WatchResult,
} from './index.js';

type FrontendConf = NonNullable<Parameters<typeof frontendCompiler>[0]>;

// Compile-time checks of the public API: `lint:ts` fails when a type widens or loses a member.
describe('public API types', () => {
  describe('negative cases', () => {
    it('does not accept arbitrary values for html, port or styles', () => {
      expectTypeOf<number>().not.toExtend<FrontendConf['html']>();
      expectTypeOf<string>().not.toExtend<FrontendConf['port']>();
      expectTypeOf<true>().not.toExtend<FrontendConf['styles']>();
    });

    it('keeps the options every compiler sets itself out of the public conf', () => {
      expectTypeOf<CompilerConf>().not.toHaveProperty('name');
      expectTypeOf<CompilerConf>().not.toHaveProperty('library');
      expectTypeOf<CompilerConf>().not.toHaveProperty('compilerName');
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

    it('exports the conf, page and callback types the compilers take', () => {
      expectTypeOf<FrontendConf>().toEqualTypeOf<Partial<CompilerConf>>();
      expectTypeOf<CompilerConf['nodejs']>().toEqualTypeOf<boolean | undefined>();
      expectTypeOf<{ inject: 'body'; minify: false; templateParameters: { lang: string } }>().toExtend<HtmlPage>();
      expectTypeOf<NonNullable<Parameters<typeof frontendCompiler>[1]>>().toEqualTypeOf<CompilerCallback>();
    });

    it('resolves isomorphicCompiler to a finished build or a watching build', () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- both overloads resolve to the same result
      expectTypeOf(null as unknown as ReturnType<typeof isomorphicCompiler>).resolves.toEqualTypeOf<
        BuildResult | WatchResult
      >();
    });

    it('requires the library name in the options object', () => {
      expectTypeOf<LibraryCompilerOptions>().toHaveProperty('name').toEqualTypeOf<string>();
    });
  });
});
