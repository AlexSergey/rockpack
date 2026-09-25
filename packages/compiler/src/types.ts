import type CopyWebpackPlugin from 'copy-webpack-plugin';

export type CompilerConf = {
  banner?: boolean | string;
  // Production builds cache modules on disk in node_modules/.cache/rockpack.
  cache?: boolean;
  cjs?: FormatConf;
  copy?: CopyConf;
  debug?: boolean;
  dist: string;
  esm?: FormatConf;
  externals?: unknown;
  global?: Record<string, string>;
  html?: boolean | HtmlPage | HtmlPage[];
  // Globs the per-file builds (esm, cjs) and the declarations skip; defaults to specs, tests and fixtures.
  ignore?: string[];
  library?: string;
  // Lint with ESLint and Stylelint during the build when their configs exist.
  lint?: boolean;
  name?: string;
  port?: number;
  // Draw progress bars in a terminal; summaries and problems are printed either way.
  progress?: boolean;
  src: string;
  styles?: false | string;
  types?: string;
  vendor?: string[];
  version?: string;
  // sourceCompiler: rebuild after every change until stop().
  watch?: boolean;
};

export type HtmlPage = {
  code?: null | string | undefined;
  favicon?: null | string | undefined;
  filename?: false | string;
  inject?: false;
  minify?: { collapseWhitespace: boolean };
  template?: string;
  templateParameters?: Record<string, unknown>;
  title?: string;
};

export type InternalCompilerConf = CompilerConf & InternalProps;

export type Mode = 'development' | 'production';

export type { PackageJson } from '@rockpack/utils';

type CopyConf = CopySpec | CopySpec[] | { files: CopySpec[]; opts?: CopyPluginOptions };

type CopyPluginOptions = NonNullable<NonNullable<ConstructorParameters<typeof CopyWebpackPlugin>[0]>['options']>;

type CopySpec = {
  from: string;
  to: string;
};

type FormatConf = {
  dist: string;
  src: string;
};

type InternalProps = {
  __isBackend?: boolean;
  __isIsomorphic?: boolean;
  __isIsomorphicBackend?: boolean;
  __isIsomorphicFrontend?: boolean;
  __isIsomorphicStyles?: boolean;
  __library?: boolean;
  compilerName?: string;
  distContext?: string;
  nodejs?: boolean;
};
